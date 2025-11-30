const Attendance = require("../models/Attendance");
const User = require("../models/User");

// Employee Check In
exports.checkIn = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date().toISOString().slice(0, 10);

    const alreadyMarked = await Attendance.findOne({ userId, date: today });
    if (alreadyMarked) {
      return res.status(400).json({ msg: "Already checked in today" });
    }

    const attendance = await Attendance.create({
      userId,
      date: today,
      checkInTime: new Date().toLocaleTimeString(),
      status: "present"
    });

    res.json({ msg: "Checked in", attendance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Employee Check Out
exports.checkOut = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date().toISOString().slice(0, 10);

    const attendance = await Attendance.findOne({ userId, date: today });
    if (!attendance) {
      return res.status(400).json({ msg: "You didn't check in today" });
    }

    attendance.checkOutTime = new Date().toLocaleTimeString();

    const checkInDate = new Date(`${today} ${attendance.checkInTime}`);
    const checkOutDate = new Date(`${today} ${attendance.checkOutTime}`);

    const diffHours = (checkOutDate - checkInDate) / (1000 * 60 * 60);
    attendance.totalHours = diffHours.toFixed(2);

    await attendance.save();

    res.json({ msg: "Checked out", attendance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Employee Attendance History
exports.myHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const history = await Attendance.find({ userId }).sort({ date: -1 });

    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Employee Monthly Summary
exports.mySummary = async (req, res) => {
  try {
    const userId = req.user.id;
    const month = new Date().getMonth() + 1;

    const records = await Attendance.find({ userId });

    const summary = {
      present: 0,
      absent: 0,
      late: 0,
      halfday: 0,
      totalHours: 0
    };

    records.forEach(r => {
      const recordMonth = Number(r.date.split("-")[1]);
      if (recordMonth === month) {
        summary[r.status] = (summary[r.status] || 0) + 1;
        summary.totalHours += r.totalHours || 0;
      }
    });

    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===============================
// MANAGER FEATURES
// ===============================

exports.getAllAttendance = async (req, res) => {
  try {
    const records = await Attendance.find().populate("userId", "name email employeeId department role");
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getEmployeeAttendance = async (req, res) => {
  try {
    const userId = req.params.id;
    const records = await Attendance.find({ userId }).sort({ date: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.todayStatus = async (req, res) => {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const records = await Attendance.find({ date: today }).populate("userId", "name email employeeId");
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.teamSummary = async (req, res) => {
  try {
    const records = await Attendance.find();
    let summary = {
      present: 0,
      absent: 0,
      late: 0,
      halfday: 0,
      totalHours: 0
    };

    records.forEach(r => {
      summary[r.status] = (summary[r.status] || 0) + 1;
      summary.totalHours += r.totalHours || 0;
    });

    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const { Parser } = require("json2csv");

exports.exportCSV = async (req, res) => {
  try {
    let { startDate, endDate, employeeId } = req.query;

    // Validate date order
    if (startDate && endDate) {
      if (new Date(startDate) > new Date(endDate)) {
        return res.status(400).json({
          error: "Start Date must be earlier than End Date"
        });
      }
    }

    // Build filter object
    let filter = {};

    if (startDate && endDate) {
      filter.date = {
        $gte: startDate,
        $lte: endDate
      };
    }

    if (employeeId && employeeId !== "all") {
      filter.userId = employeeId;
    }

    const records = await Attendance.find(filter).populate(
      "userId",
      "name email employeeId department"
    );

    const fields = [
      "userId.name",
      "userId.email",
      "userId.employeeId",
      "userId.department",
      "date",
      "checkInTime",
      "checkOutTime",
      "status",
      "totalHours"
    ];

    const { Parser } = require("json2csv");
    const json2csv = new Parser({ fields });
    const csv = json2csv.parse(records);

    res.header("Content-Type", "text/csv");
    res.attachment("attendance_report.csv");
    res.send(csv);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getWeeklyTrend = async (req, res) => {
  try {
    const data = await Attendance.aggregate([
      {
        $group: {
          _id: "$date",
          totalHours: { $sum: "$totalHours" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Convert dates to day names (Mon, Tue, ...)
    const result = data.map(item => {
      const day = new Date(item._id).toLocaleString("en-US", { weekday: "short" });
      return { day, hours: item.totalHours };
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getDepartmentSummary = async (req, res) => {
  try {
    const data = await Attendance.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" },
      {
        $group: {
          _id: "$user.department",
          presentDays: { $sum: 1 }
        }
      }
    ]);

    const formatted = data.map(item => ({
      department: item._id,
      presentDays: item.presentDays
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
