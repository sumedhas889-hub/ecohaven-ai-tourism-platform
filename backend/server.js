require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const rateLimit = require("express-rate-limit");
const { OAuth2Client } = require("google-auth-library");

const prisma = require("./prismaClient");
const requireAuth = require("./middleware/authMiddleware");

const app = express();

/* =====================================================
   CONFIGURATION
===================================================== */

app.use(
  cors({
    origin: true,
    credentials: true
  })
);

app.use(express.json());

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID
);

/* =====================================================
   HOME / HEALTH CHECK
===================================================== */

app.get("/", (req, res) => {
  res.status(200).json({
    message: "EcoHaven Backend Running 🚀"
  });
});

app.get("/api/test", (req, res) => {
  res.status(200).json({
    message: "EcoHaven API is working!"
  });
});

/* =====================================================
   RATE LIMITERS
===================================================== */

const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    message: "Too many registration attempts. Please try again later."
  }
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    message: "Too many login attempts. Please try again later."
  }
});

/* =====================================================
   REGISTER
===================================================== */

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
        where: { email }
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

      return res.status(201).json({
        message: "User registered successfully",
        user: {
          id: user.id,
          email: user.email,
          createdAt: user.createdAt
        }
      });
    } catch (err) {
      console.error("Registration error:", err);

      return res.status(500).json({
        message: "Internal server error"
      });
    }
  }
);

/* =====================================================
   LOGIN
===================================================== */

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

      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        return res.status(401).json({
          message: "Invalid email or password"
        });
      }

      const passwordMatch = await bcrypt.compare(
        password,
        user.password
      );

      if (!passwordMatch) {
        return res.status(401).json({
          message: "Invalid email or password"
        });
      }

      if (!process.env.JWT_SECRET) {
        console.error("JWT_SECRET is missing");

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
        message: "Login successful",
        token,
        user: {
          id: user.id,
          email: user.email
        }
      });
    } catch (err) {
      console.error("Login error:", err);

      return res.status(500).json({
        message: "Internal server error"
      });
    }
  }
);

/* =====================================================
   GOOGLE LOGIN
===================================================== */

app.post("/api/auth/google", async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        message: "Google credential is required"
      });
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.status(500).json({
        message: "Google Client ID is not configured"
      });
    }

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

    let user = await prisma.user.findUnique({
      where: { email }
    });

    /*
      Your Prisma User model currently requires password.
      Therefore Google users need a value here instead of null.
    */
    if (!user) {
      const randomPassword = await bcrypt.hash(
        `${email}-${Date.now()}-${Math.random()}`,
        12
      );

      user = await prisma.user.create({
        data: {
          email,
          password: randomPassword
        }
      });
    }

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
   CREATE HOMESTAY
===================================================== */

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

    return res.status(201).json(homestay);
  } catch (err) {
    console.error("Create homestay error:", err);

    return res.status(500).json({
      message: err.message
    });
  }
});

/* =====================================================
   GET ALL HOMESTAYS
===================================================== */

app.get("/api/homestays", async (req, res) => {
  try {
    const homestays = await prisma.homestay.findMany();

    return res.status(200).json(homestays);
  } catch (err) {
    console.error("Get homestays error:", err);

    return res.status(500).json({
      message: err.message
    });
  }
});

/* =====================================================
   GET ONE HOMESTAY
===================================================== */

app.get(
  "/api/homestays/:id",
  requireAuth,
  async (req, res) => {
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

      return res.status(200).json(homestay);
    } catch (err) {
      console.error("Get homestay error:", err);

      return res.status(500).json({
        message: err.message
      });
    }
  }
);

/* =====================================================
   UPDATE HOMESTAY
===================================================== */

app.put("/api/homestays/:id", async (req, res) => {
  try {
    const updated = await prisma.homestay.update({
      where: {
        id: req.params.id
      },
      data: req.body
    });

    return res.status(200).json(updated);
  } catch (err) {
    console.error("Update homestay error:", err);

    return res.status(500).json({
      message: err.message
    });
  }
});

/* =====================================================
   DELETE HOMESTAY
===================================================== */

app.delete(
  "/api/homestays/:id",
  requireAuth,
  async (req, res) => {
    try {
      await prisma.homestay.delete({
        where: {
          id: req.params.id
        }
      });

      return res.status(200).json({
        message: "Homestay deleted successfully"
      });
    } catch (err) {
      console.error("Delete homestay error:", err);

      return res.status(500).json({
        message: err.message
      });
    }
  }
);

/* =====================================================
   SEARCH HOMESTAYS
===================================================== */

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

    return res.status(200).json(results);
  } catch (err) {
    console.error("Search error:", err);

    return res.status(500).json({
      message: err.message
    });
  }
});

/* =====================================================
   EXPORT EXPRESS APP
===================================================== */

module.exports = app;