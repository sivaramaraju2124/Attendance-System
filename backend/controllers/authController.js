const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password, department, role } = req.body;

    // ---- CHECK ONLY EMAIL ----
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ msg: "Email already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Auto-generate employeeId (optional – remove if not needed)
    const generatedEmpId = Math.floor(100000 + Math.random() * 900000).toString();

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      department,
      role: role || "employee",
      employeeId: generatedEmpId
    });

    res.status(201).json({
      msg: "User registered",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        department: user.department,
        employeeId: user.employeeId,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // find email only
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      msg: "Login success",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        employeeId: user.employeeId
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// GET LOGGED-IN USER DETAILS
exports.me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      employeeId: user.employeeId
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// CHANGE PASSWORD
exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found." });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Incorrect current password." });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ msg: "Password updated successfully." });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
