require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// In-memory data
let homestays = [
  {
    id: 1,
    name: "Mountain View Homestay",
    location: "Manali",
    price: 2500
  },
  {
    id: 2,
    name: "Riverside Eco Stay",
    location: "Rishikesh",
    price: 3000
  },
  {
    id: 3,
    name: "Forest Cabin",
    location: "Coorg",
    price: 2800
  }
];

// Home Route
app.get("/", (req, res) => {
  res.json({
    message: "EcoHaven Backend Running 🚀"
  });
});

// GET all homestays
app.get("/api/homestays", (req, res) => {
  res.status(200).json(homestays);
});

// GET one homestay
app.get("/api/homestays/:id", (req, res) => {
  const homestay = homestays.find(
    (h) => h.id === parseInt(req.params.id)
  );

  if (!homestay) {
    return res.status(404).json({
      message: "Homestay not found"
    });
  }

  res.status(200).json(homestay);
});

// POST new homestay
app.post("/api/homestays", (req, res) => {
  console.log("Request Body:", req.body);

  const { name, location, price } = req.body;

  if (!name || !location || !price) {
    return res.status(400).json({
      message: "All fields are required"
    });
  }

  const newHomestay = {
    id: homestays.length + 1,
    name,
    location,
    price
  };

  homestays.push(newHomestay);

  res.status(201).json(newHomestay);
});

// PUT update homestay
app.put("/api/homestays/:id", (req, res) => {
  const homestay = homestays.find(
    (h) => h.id === parseInt(req.params.id)
  );

  if (!homestay) {
    return res.status(404).json({
      message: "Homestay not found"
    });
  }

  homestay.name = req.body.name || homestay.name;
  homestay.location = req.body.location || homestay.location;
  homestay.price = req.body.price || homestay.price;

  res.status(200).json(homestay);
});

// DELETE homestay
app.delete("/api/homestays/:id", (req, res) => {
  const index = homestays.findIndex(
    (h) => h.id === parseInt(req.params.id)
  );

  if (index === -1) {
    return res.status(404).json({
      message: "Homestay not found"
    });
  }

  homestays.splice(index, 1);

  res.status(204).send();
});

// SEARCH homestays
app.get("/api/search", (req, res) => {
  const q = (req.query.q || "").toLowerCase();

  const result = homestays.filter(
    (h) =>
      h.name.toLowerCase().includes(q) ||
      h.location.toLowerCase().includes(q)
  );

  res.status(200).json(result);
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    message: "Internal Server Error"
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});