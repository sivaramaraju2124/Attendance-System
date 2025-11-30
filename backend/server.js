const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/attendance", require("./routes/attendanceRoutes"));

app.get("/", (req, res) => {
  res.send("API is working");
});

app.listen(process.env.PORT || 5000, () => {
  console.log("Server running on port 5000");
});
