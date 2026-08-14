require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

/* =====================================================
   HEALTH CHECK
===================================================== */

app.get("/", (req, res) => {
  res.status(200).json({
    message: "EcoHaven Backend is running!"
  });
});

/* =====================================================
   TEST API
===================================================== */

app.get("/api/test", (req, res) => {
  res.status(200).json({
    message: "Backend API is working!"
  });
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