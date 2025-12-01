import api from "../api";
import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
  useTheme
} from "@mui/material";

import {
  Group,
  EventAvailable,
  EventBusy,
  TimerOff,
  ListAlt
} from "@mui/icons-material";

import { motion } from "framer-motion";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from "recharts";

export default function ManagerDashboard() {
  const token = localStorage.getItem("token");
  const theme = useTheme();

  const [summary, setSummary] = useState({});
  const [todayAttendance, setTodayAttendance] = useState([]);

  const [weeklyTrend, setWeeklyTrend] = useState([]);
  const [departmentAttendance, setDepartmentAttendance] = useState([]);

  useEffect(() => {
    fetchSummary();
    fetchToday();
    fetchWeeklyTrend();
    fetchDepartmentSummary();
  }, []);

  const fetchSummary = async () => {
    const res = await api.get("/api/attendance/summary", {
      headers: { Authorization: `Bearer ${token}` }
    });
    setSummary(res.data);
  };

  const fetchToday = async () => {
    const res = await api.get("/api/attendance/today-status", {
      headers: { Authorization: `Bearer ${token}` }
    });
    setTodayAttendance(res.data);
  };

  const fetchWeeklyTrend = async () => {
    const res = await api.get("/api/attendance/weekly-trend", {
      headers: { Authorization: `Bearer ${token}` }
    });
    setWeeklyTrend(res.data);
  };

  const fetchDepartmentSummary = async () => {
    const res = await api.get("/api/attendance/department-summary", {
      headers: { Authorization: `Bearer ${token}` }
    });
    setDepartmentAttendance(res.data);
  };

  const StatCard = ({ title, value, icon, color }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card
        elevation={4}
        sx={{
          borderRadius: 3,
          borderLeft: `8px solid ${color}`,
          padding: 1
        }}
      >
        <CardContent>
          <Box display="flex" alignItems="center" gap={2}>
            {icon}
            <Box>
              <Typography variant="subtitle1">{title}</Typography>
              <Typography variant="h5" fontWeight="800">
                {value}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );

  const absentEmployees = todayAttendance.filter((t) => !t.checkInTime);
  const checkedInEmployees = todayAttendance.filter((t) => t.checkInTime);

  return (
    <Box sx={{ background: "#f4f6f8", minHeight: "100vh", paddingY: 4 }}>
      <Container maxWidth="xl">

        {/* HEADER */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1 }}>
          <Typography
            variant="h4"
            fontWeight="800"
            sx={{ color: "#1a237e", mb: 1 }}
          >
            Manager Dashboard
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 4 }}>
            Overview of today's attendance & team performance
          </Typography>
        </motion.div>

        {/* STATS */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <StatCard
              title="Total Employees"
              value={
                (summary.present || 0) +
                (summary.absent || 0) +
                (summary.late || 0) +
                (summary.halfday || 0)
              }
              icon={<Group sx={{ fontSize: 40, color: theme.palette.info.main }} />}
              color={theme.palette.info.main}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <StatCard
              title="Present Today"
              value={summary.present}
              icon={<EventAvailable sx={{ fontSize: 40, color: theme.palette.success.main }} />}
              color={theme.palette.success.main}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <StatCard
              title="Absent Today"
              value={summary.absent}
              icon={<EventBusy sx={{ fontSize: 40, color: theme.palette.error.main }} />}
              color={theme.palette.error.main}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <StatCard
              title="Late Arrivals"
              value={summary.late}
              icon={<TimerOff sx={{ fontSize: 40, color: theme.palette.warning.main }} />}
              color={theme.palette.warning.main}
            />
          </Grid>
        </Grid>

        {/* CHARTS */}
        <Box
          sx={{
            display: "flex",
            overflowX: "auto",
            gap: 3,
            mt: 3,
            pb: 2,
            scrollBehavior: "smooth",
            "&::-webkit-scrollbar": { height: 10 },
            "&::-webkit-scrollbar-thumb": {
              background: "#9e9e9e",
              borderRadius: 5
            }
          }}
        >
          {/* WEEKLY TREND */}
          <Card
            elevation={4}
            sx={{
              minWidth: "900px",
              borderRadius: 3,
              flexShrink: 0
            }}
          >
            <CardHeader title="Weekly Attendance Trend (Hours)" />
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={weeklyTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="hours" fill={theme.palette.primary.main} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* DEPARTMENT BREAKDOWN */}
          <Card
            elevation={4}
            sx={{
              minWidth: "900px",
              borderRadius: 3,
              flexShrink: 0
            }}
          >
            <CardHeader title="Department Attendance Breakdown" />
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={departmentAttendance} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="department" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="presentDays" fill={theme.palette.secondary.main} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Box>

        {/* LISTS */}
        <Grid container spacing={3} sx={{ mt: 3 }}>

          {/* ABSENT LIST */}
          <Grid item xs={12} md={6}>
            <Card elevation={4} sx={{ borderRadius: 3 }}>
              <Box
                sx={{
                  background: theme.palette.error.light,
                  color: "#fff",
                  padding: 2,
                  borderTopLeftRadius: 12,
                  borderTopRightRadius: 12
                }}
              >
                <Typography variant="h6">Absent Employees Today</Typography>
              </Box>

              <List sx={{ maxHeight: 350, overflowY: "auto" }}>
                {absentEmployees.map((emp) => (
                  <div key={emp._id}>
                    <ListItem>
                      <ListItemText
                        primary={`${emp.userId?.name} (${emp.userId?.employeeId})`}
                        secondary={`Department: ${emp.userId?.department}`}
                      />
                    </ListItem>
                    <Divider />
                  </div>
                ))}
              </List>
            </Card>
          </Grid>

          {/* CHECKED-IN LIST */}
          <Grid item xs={12} md={6}>
            <Card elevation={4} sx={{ borderRadius: 3 }}>
              <Box
                sx={{
                  background: theme.palette.success.light,
                  color: "#fff",
                  padding: 2,
                  borderTopLeftRadius: 12,
                  borderTopRightRadius: 12
                }}
              >
                <Typography variant="h6">Checked-In Employees Today</Typography>
              </Box>

              <List sx={{ maxHeight: 350, overflowY: "auto" }}>
                {checkedInEmployees.map((emp) => (
                  <div key={emp._id}>
                    <ListItem>
                      <ListItemText
                        primary={`${emp.userId?.name} (${emp.userId?.employeeId})`}
                        secondary={`In: ${emp.checkInTime} | Out: ${
                          emp.checkOutTime || "In Office"
                        }`}
                      />
                    </ListItem>
                    <Divider />
                  </div>
                ))}
              </List>
            </Card>
          </Grid>

        </Grid>

        {/* BUTTONS */}
        <Box sx={{ mt: 4 }}>
          <Button
            variant="contained"
            href="/manager/employees"
            startIcon={<Group />}
            sx={{ mr: 2 }}
          >
            View All Employees
          </Button>

          <Button
            variant="outlined"
            href="/manager/export"
            startIcon={<ListAlt />}
          >
            Generate Detailed Reports
          </Button>
        </Box>

      </Container>
    </Box>
  );
}
