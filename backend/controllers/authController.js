const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password, employeeId, department, role } = req.body; // Added employeeId
    
    // Check if email or employeeId already exists
    const existingUser = await User.findOne({ $or: [{ email }, { employeeId }] });
    if (existingUser) {
      return res.status(400).json({ msg: "Email or Employee ID already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      employeeId, // Added
      department,
      role: role || "employee"
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

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials (User not found)" });

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) return res.status(400).json({ msg: "Invalid credentials (Wrong password)" });

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

// GET LOGGED-IN USER DETAILS (REQUIRED FOR PROFILE/DASHBOARD)
exports.me = async (req, res) => {
  try {
    // req.user.id is set by the authMiddleware from the JWT payload
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
      employeeId: user.employeeId // Ensure employeeId is returned
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST: UPDATE USER PASSWORD (REQUIRED FOR PROFILE PAGE)
exports.changePassword = async (req, res) => {
    try {
        // 1. Get user ID from the authenticated token
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;

        // 2. Fetch the user record, including the hashed password
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: "User not found." });
        }

        // 3. Verify the current password (HIGH SECURITY CHECK)
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Incorrect current password." });
        }

        // 4. Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        // 5. Update the user record
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ msg: "Password updated successfully." });

    } catch (error) {
        console.error('Password change error:', error);
        res.status(500).json({ error: error.message });
    }
};