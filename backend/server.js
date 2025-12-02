const express = require("express");
const cors = require("cors");
require("dotenv").config();
const path = require("path");
const connectDB = require("./config/db");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/attendance", require("./routes/attendanceRoutes"));

// Serve frontend build
app.use(express.static(path.join(__dirname, "..", "frontend", "build")));

// If no API routes match → send index.html (REACT ROUTER SUPPORT)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "build", "index.html"));
});

app.listen(process.env.PORT || 5000, () => {
  console.log("Server running on port 5000");
});
