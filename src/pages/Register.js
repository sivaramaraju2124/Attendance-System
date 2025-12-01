import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  Container,
  Paper,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Snackbar,
  CircularProgress,
  InputAdornment,
  IconButton,
  LinearProgress,
  MenuItem
} from "@mui/material";

import {
  PersonAdd,
  Email,
  Lock,
  Work,
  Visibility,
  VisibilityOff
} from "@mui/icons-material";

import { motion } from "framer-motion";

// Motion wrapper fix for deprecation warning
const MotionPaper = motion.create(Paper);

// Animations
const cardVariants = {
  hidden: { opacity: 0, y: -40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const buttonHover = {
  scale: 1.05
};

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      department: "",
      role: "employee"   // added
  });


  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordLabel, setPasswordLabel] = useState("");

  const [loading, setLoading] = useState(false);
  const [alertMsg, setAlertMsg] = useState(null);
  const [alertType, setAlertType] = useState("success");

  // Password strength checker
  const evaluateStrength = (password) => {
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[@$!%*?&#]/.test(password)) score++;

    setPasswordStrength(score);

    const labels = ["Very Weak", "Weak", "Moderate", "Strong", "Very Strong"];
    setPasswordLabel(labels[Math.min(score, 4)]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === "password") evaluateStrength(value);
  };

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.password || !form.confirmPassword || !form.department) {
      setAlertMsg("All fields are required.");
      setAlertType("error");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setAlertMsg("Passwords do not match.");
      setAlertType("error");
      return;
    }

    setLoading(true);
    setAlertMsg(null);

    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
        department: form.department,
        role: form.role
    });


      setAlertMsg("Registration successful! Redirecting...");
      setAlertType("success");

      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setAlertMsg(err.response?.data?.msg || "Registration failed. Try again.");
      setAlertType("error");
    }

    setLoading(false);
  };

  const handleCloseSnackbar = () => setAlertMsg(null);

  return (
    <Box sx={{ background: "#f4f6f8", minHeight: "100vh", py: 6 }}>
      <Container maxWidth="xs">
        
        <MotionPaper
          elevation={10}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          sx={{ p: 4, borderRadius: 3 }}
        >
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <PersonAdd color="primary" sx={{ fontSize: 40 }} />

            <Typography variant="h5" fontWeight="bold" sx={{ mt: 1 }}>
              Employee Registration
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Create a new employee account
            </Typography>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            
            <TextField
              label="Full Name"
              name="name"
              fullWidth
              required
              value={form.name}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonAdd />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Work Email"
              name="email"
              fullWidth
              required
              type="email"
              value={form.email}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email />
                  </InputAdornment>
                ),
              }}
            />

            {/* PASSWORD */}
            <TextField
              label="Password"
              name="password"
              required
              fullWidth
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {form.password && (
              <>
                <LinearProgress
                  variant="determinate"
                  value={(passwordStrength / 5) * 100}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    "& .MuiLinearProgress-bar": {
                      background:
                        passwordStrength < 2
                          ? "red"
                          : passwordStrength < 3
                          ? "orange"
                          : passwordStrength < 4
                          ? "gold"
                          : "green",
                    },
                  }}
                />
                <Typography variant="caption" sx={{ color: "gray" }}>
                  {passwordLabel}
                </Typography>
              </>
            )}

            {/* CONFIRM PASSWORD */}
            <TextField
              label="Confirm Password"
              name="confirmPassword"
              required
              fullWidth
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                ),
              }}
            />

            {/* DEPARTMENT */}
            <TextField
              label="Department"
              name="department"
              fullWidth
              required
              value={form.department}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Work />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              select
              label="Role"
              name="role"
              fullWidth
              required
              value={form.role}
              onChange={handleChange}
            >
              <MenuItem value="employee">Employee</MenuItem>
              <MenuItem value="manager">Manager</MenuItem>
            </TextField>

            {/* REGISTER BUTTON */}
            <motion.div whileHover={buttonHover} whileTap={{ scale: 0.95 }}>
              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={handleRegister}
                disabled={loading}
                startIcon={loading && <CircularProgress size={20} />}
              >
                {loading ? "Processing..." : "Create Account"}
              </Button>
            </motion.div>

            <Button variant="text" fullWidth href="/">
              Already have an account? Login here
            </Button>

          </Box>
        </MotionPaper>

        {/* Alert */}
        <Snackbar
          open={!!alertMsg}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
        >
          <Alert severity={alertType} onClose={handleCloseSnackbar}>
            {alertMsg}
          </Alert>
        </Snackbar>

      </Container>
    </Box>
  );
}
