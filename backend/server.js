const express = require("express");
const cors = require("cors");
require("dotenv").config();
const path = require("path");
const connectDB = require("./config/db");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

// API routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/attendance", require("./routes/attendanceRoutes"));

// OPTIONAL health check
app.get("/api", (req, res) => {
  res.send("API is working");
});

// Serve React build
app.use(express.static(path.join(__dirname, "build")));

// React Router fallback
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(process.env.PORT || 5000, () => {
  console.log("Server running");
});
