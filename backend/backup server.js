require("dotenv").config();

const { OAuth2Client } = require("google-auth-library");
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const rateLimit = require("express-rate-limit");

const prisma = require("./prismaClient");

const app = express();
const requireAuth = require("./middleware/authMiddleware");
const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID
);

app.use(cors());
app.use(express.json());

/* =====================================================
   HOME ROUTE
===================================================== */

app.get("/", (req, res) => {
  res.json({
    message: "EcoHaven Backend Running 🚀 (Prisma + Supabase)"
  });
});

/* =====================================================
   AUTHENTICATION
===================================================== */

/* ---------------- REGISTER RATE LIMIT ---------------- */

const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    message: "Too many registration attempts. Please try again later."
  }
});

/* ---------------- LOGIN RATE LIMIT ---------------- */

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    message: "Too many login attempts. Please try again later."
  }
});

/* ---------------- REGISTER ---------------- */
app.get("/", (req, res) => {
  res.send("EcoHaven Backend is running!");
});
app.post(
  "/api/auth/register",
  registerLimiter,

  [
    body("email")
      .isEmail()
      .withMessage("Please provide a valid email")
      .normalizeEmail(),

    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long")
  ],

  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Validation failed",
          errors: errors.array()
        });
      }

      const { email, password } = req.body;

      const existingUser = await prisma.user.findUnique({
        where: {
          email
        }
      });

      if (existingUser) {
        return res.status(400).json({
          message: "Email is already registered"
        });
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword
        }
      });

      res.status(201).json({
        message: "User registered successfully",
        user: {
          id: user.id,
          email: user.email,
          createdAt: user.createdAt
        }
      });

    } catch (err) {
      console.error("Registration error:", err);

      res.status(500).json({
        message: "Internal server error"
      });
    }
  }
);

/* ---------------- LOGIN ---------------- */

app.post(
  "/api/auth/login",
  loginLimiter,

  [
    body("email")
      .isEmail()
      .withMessage("Please provide a valid email")
      .normalizeEmail(),

    body("password")
      .notEmpty()
      .withMessage("Password is required")
  ],

  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Validation failed",
          errors: errors.array()
        });
      }

      const { email, password } = req.body;

      /* Find user */
      const user = await prisma.user.findUnique({
        where: {
          email
        }
      });

      if (!user) {
        return res.status(401).json({
          message: "Invalid email or password"
        });
      }

      /* Compare password */
      const passwordMatch = await bcrypt.compare(
        password,
        user.password
      );

      if (!passwordMatch) {
        return res.status(401).json({
          message: "Invalid email or password"
        });
      }

      /* Check JWT secret */
      if (!process.env.JWT_SECRET) {
        console.error("JWT_SECRET is missing from .env");

        return res.status(500).json({
          message: "JWT configuration error"
        });
      }

      /* Create JWT */
      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d"
        }
      );

      /* Return token */
      res.status(200).json({
        message: "Login successful",
        token,
        user: {
          id: user.id,
          email: user.email
        }
      });

    } catch (err) {
      console.error("Login error:", err);

      res.status(500).json({
        message: "Internal server error"
      });
    }
  }
);
 
app.post("/api/auth/google", async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        message: "Google credential is required"
      });
    }

    // Verify Google credential
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();

    const email = payload.email;

    if (!email) {
      return res.status(400).json({
        message: "Google account email not found"
      });
    }

    // Find existing user
    let user = await prisma.user.findUnique({
      where: {
        email
      }
    });

    // Create user if they don't exist
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          password: null
        }
      });
    }

    // Create EcoHaven JWT
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        message: "JWT configuration error"
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    return res.status(200).json({
      message: "Google login successful",
      token,
      user: {
        id: user.id,
        email: user.email
      }
    });

  } catch (err) {
    console.error("Google login error:", err);

    return res.status(401).json({
      message: "Google authentication failed"
    });
  }
});
/* =====================================================
   HOMESTAY CRUD
===================================================== */

/* ---------------- CREATE ---------------- */

app.post("/api/homestays", async (req, res) => {
  try {
    const { name, location, price } = req.body;

    const homestay = await prisma.homestay.create({
      data: {
        name,
        location,
        price: Number(price)
      }
    });

    res.status(201).json(homestay);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: err.message
    });
  }
});

/* ---------------- READ ALL ---------------- */

app.get("/api/homestays", async (req, res) => {
  try {
    const homestays = await prisma.homestay.findMany();

    res.status(200).json(homestays);

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

/* ---------------- READ ONE ---------------- */

app.get("/api/homestays/:id", requireAuth, async (req, res) => {
  try {
    const homestay = await prisma.homestay.findUnique({
      where: {
        id: req.params.id
      }
    });

    if (!homestay) {
      return res.status(404).json({
        message: "Homestay not found"
      });
    }

    res.status(200).json(homestay);

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

/* ---------------- UPDATE ---------------- */

app.put("/api/homestays/:id", async (req, res) => {
  try {
    const updated = await prisma.homestay.update({
      where: {
        id: req.params.id
      },
      data: req.body
    });

    res.status(200).json(updated);

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

/* ---------------- DELETE ---------------- */

app.delete("/api/homestays/:id", requireAuth, async (req, res) => {
  try {
    await prisma.homestay.delete({
      where: {
        id: req.params.id
      }
    });

    res.status(200).json({
      message: "Homestay deleted successfully"
    });

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

/* ---------------- SEARCH ---------------- */

app.get("/api/search", async (req, res) => {
  try {
    const q = req.query.q || "";

    const results = await prisma.homestay.findMany({
      where: {
        OR: [
          {
            name: {
              contains: q,
              mode: "insensitive"
            }
          },
          {
            location: {
              contains: q,
              mode: "insensitive"
            }
          }
        ]
      }
    });

    res.status(200).json(results);

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

/* =====================================================
   SERVER
===================================================== */

if (require.main === module) {
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;