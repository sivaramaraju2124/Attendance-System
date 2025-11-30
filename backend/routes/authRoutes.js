const express = require("express");
const router = express.Router();
const { register, login, me } = require("../controllers/authController");
const auth = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);

// NEW: Logged-in user route
router.get("/me", auth, me);

module.exports = router;
