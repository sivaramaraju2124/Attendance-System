import React from "react";
import { AppBar, Toolbar, Typography, Button, Box, IconButton } from "@mui/material";
import { Dashboard, Group, ExitToApp, Menu, Person } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const MotionAppBar = motion(AppBar);

export default function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const userName = localStorage.getItem("userName") || "User";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const go = (path) => navigate(path);

  return (
    <MotionAppBar
      position="static"
      elevation={6}
      sx={{
        background: "#1a237e",
        mb: 3,
      }}
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        
        {/* LEFT SECTION: LOGO + TITLE */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton color="inherit" sx={{ display: { xs: "block", md: "none" } }}>
            <Menu />
          </IconButton>

          <Typography variant="h6" fontWeight="bold">
            Attendance System
          </Typography>
        </Box>

        {/* CENTER NAV BUTTONS — DESKTOP ONLY */}
        {token && (
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 2,
              alignItems: "center",
            }}
          >
            {/* Dashboard */}
            <Button
              color="inherit"
              startIcon={<Dashboard />}
              onClick={() =>
                go(role === "manager" ? "/manager/dashboard" : "/employee/dashboard")
              }
            >
              Dashboard
            </Button>

            {/* Employee-only */}
            {role === "employee" && (
              <>
                <Button color="inherit" onClick={() => go("/employee/history")}>
                  History
                </Button>
                <Button color="inherit" onClick={() => go("/employee/summary")}>
                  Summary
                </Button>
              </>
            )}

            {/* Manager-only */}
            {role === "manager" && (
              <>
                <Button color="inherit" startIcon={<Group />} onClick={() => go("/manager/employees")}>
                  Employees
                </Button>
                <Button color="inherit" onClick={() => go("/manager/export")}>
                  Reports
                </Button>


              
              </>
              
            )}
            
          </Box>
        )}

        {/* RIGHT SIDE — USER INFO + LOGOUT */}
        {token && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              {userName} ({role})
            </Typography>

            <Button
              color="error"
              variant="contained"
              onClick={handleLogout}
              startIcon={<ExitToApp />}
              sx={{ textTransform: "none" }}
            >
              Logout
            </Button>
          </Box>
        )}
      </Toolbar>
    </MotionAppBar>
  );
}