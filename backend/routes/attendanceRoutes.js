const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const managerAuth = require("../middleware/managerMiddleware");

const {
  checkIn,
  checkOut,
  myHistory,
  mySummary,
  getAllAttendance,
  getEmployeeAttendance,
  todayStatus,
  teamSummary,
  exportCSV,
  getWeeklyTrend,
  getDepartmentSummary
} = require("../controllers/attendanceController");

// Employee routes
router.post("/checkin", auth, checkIn);
router.post("/checkout", auth, checkOut);
router.get("/my-history", auth, myHistory);
router.get("/my-summary", auth, mySummary);

// Manager routes
router.get("/all", auth, getAllAttendance);
router.get("/employee/:id", auth, getEmployeeAttendance);
router.get("/today-status", auth, todayStatus);
router.get("/summary", auth, teamSummary);
router.get("/export", auth, exportCSV);

router.get("/weekly-trend", auth, getWeeklyTrend);
router.get("/department-summary", auth, getDepartmentSummary);

module.exports = router;
