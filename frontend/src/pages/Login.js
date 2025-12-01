import React, { useState } from "react";
import api from "../api"; 
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  Snackbar,
  CircularProgress,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Lock, Email, Visibility, VisibilityOff, People } from "@mui/icons-material";
import { motion } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, y: -50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const buttonHover = {
  scale: 1.05,
  transition: { duration: 0.1 },
};

const MotionPaper = motion(Paper);

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.post("/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);

      setEmail("");
      setPassword("");

      if (res.data.user.role === "employee") {
        navigate("/employee/dashboard");
      } else {
        navigate("/manager/dashboard");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.msg || "Invalid email or password. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setError(null);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container 
      maxWidth="xs"
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: (theme) => theme.palette.grey[50],
      }}
    >
      <MotionPaper
        elevation={10}
        sx={{ padding: 4, borderRadius: 3, width: '100%' }}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <People color="primary" sx={{ fontSize: 40 }} />
          <Typography variant="h5" component="h1" fontWeight="bold" sx={{ mt: 1 }}>
            Attendance Portal
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sign in to track your time.
          </Typography>
        </Box>

        <Box 
          component="form"
          onSubmit={handleLogin}
          sx={{ display: "flex", flexDirection: "column", gap: 3 }}
        >
          <TextField
            label="Work Email"
            fullWidth
            required
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email color="action" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Password"
            fullWidth
            required
            variant="outlined"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <motion.div whileHover={buttonHover} whileTap={{ scale: 0.95 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              disabled={loading}
              sx={{ py: 1.5, mt: 1 }}
              startIcon={loading && <CircularProgress size={20} color="inherit" />}
            >
              {loading ? "Logging In..." : "Secure Login"}
            </Button>
          </motion.div>

          <Typography align="center" variant="body2" sx={{ mt: 1 }}>
            New employee?
          </Typography>

          <motion.div whileHover={buttonHover} whileTap={{ scale: 0.95 }}>
            <Button variant="outlined" color="secondary" fullWidth href="/register">
              Create an Account
            </Button>
          </motion.div>

        </Box>
      </MotionPaper>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
}
