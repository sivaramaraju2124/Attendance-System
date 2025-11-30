const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: { type: String, required: true },
  checkInTime: { type: String },
  checkOutTime: { type: String },
  status: {
    type: String,
    enum: ["present", "absent", "late", "half-day"],
    default: "present"
  },
  totalHours: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model("Attendance", attendanceSchema);