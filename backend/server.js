require("dotenv").config();

const express = require("express");
const cors = require("cors");
const prisma = require("./prismaClient");

const app = express();

app.use(cors());
app.use(express.json());

/* ---------------- HOME ROUTE ---------------- */
app.get("/", (req, res) => {
  res.json({
    message: "EcoHaven Backend Running 🚀 (Prisma + Supabase)"
  });
});

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
    res.status(500).json({ message: err.message });
  }
});

/* ---------------- READ ALL ---------------- */
app.get("/api/homestays", async (req, res) => {
  try {
    const homestays = await prisma.homestay.findMany();
    res.status(200).json(homestays);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ---------------- READ ONE ---------------- */
app.get("/api/homestays/:id", async (req, res) => {
  try {
    const homestay = await prisma.homestay.findUnique({
      where: { id: req.params.id }
    });

    if (!homestay) {
      return res.status(404).json({ message: "Homestay not found" });
    }

    res.status(200).json(homestay);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ---------------- UPDATE ---------------- */
app.put("/api/homestays/:id", async (req, res) => {
  try {
    const updated = await prisma.homestay.update({
      where: { id: req.params.id },
      data: req.body
    });

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ---------------- DELETE ---------------- */
app.delete("/api/homestays/:id", async (req, res) => {
  try {
    await prisma.homestay.delete({
      where: { id: req.params.id }
    });

    res.status(200).json({
      message: "Homestay deleted successfully"
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ---------------- SEARCH ---------------- */
app.get("/api/search", async (req, res) => {
  try {
    const q = req.query.q || "";

    const results = await prisma.homestay.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { location: { contains: q, mode: "insensitive" } }
        ]
      }
    });

    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ---------------- SERVER ---------------- */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});