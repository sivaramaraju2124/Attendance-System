import axios from "axios";
import { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Grid,
  TextField,
  Select,
  MenuItem,
  Button,
  Box,
  Alert,
  useTheme,
} from "@mui/material";

import { DateRange, Download, Person, ListAlt } from "@mui/icons-material";
import { motion } from "framer-motion";

export default function ExportCSV() {
  const token = localStorage.getItem("token");
  const theme = useTheme();

  const [employeeList, setEmployeeList] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("all");

  const [loading, setLoading] = useState(false);
  const [alertMsg, setAlertMsg] = useState(null);
  const [alertType, setAlertType] = useState("success");

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/attendance/all", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const unique = [
        ...new Map(
          res.data.map((r) => [
            r.userId?._id,
            {
              id: r.userId?._id,
              name: r.userId?.name,
              empId: r.userId?.employeeId,
            },
          ])
        ).values(),
      ];

      setEmployeeList(unique);
    } catch (err) {
      console.log(err);
    }
  };

  const handleExport = async () => {
    if (!startDate || !endDate) {
      setAlertMsg("Start Date and End Date are required.");
      setAlertType("error");
      return;
    }

    setLoading(true);
    setAlertMsg(null);

    try {
      const url = `http://localhost:5000/api/attendance/export?startDate=${startDate}&endDate=${endDate}&employeeId=${selectedEmployee}`;

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });

      const csvURL = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = csvURL;
      link.setAttribute("download", "attendance_report.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();

      setAlertMsg("CSV downloaded successfully!");
      setAlertType("success");
    } catch (err) {
      setAlertMsg("Failed to download CSV. Try again.");
      setAlertType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ background: "#f4f6f8", minHeight: "100vh", py: 5 }}>
      <Container maxWidth="md">
        {/* HEADER */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1 }}>
          <Typography
            variant="h4"
            fontWeight="800"
            sx={{ color: "#1a237e", mb: 2 }}
            textAlign="center"
          >
            Generate Attendance Report (CSV)
          </Typography>
          <Typography variant="subtitle1" textAlign="center" sx={{ mb: 4 }}>
            Choose filters below to generate a customized CSV report.
          </Typography>
        </motion.div>

        {/* FORM */}
        <Paper
          elevation={4}
          sx={{ p: 4, borderRadius: 3 }}
          component={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Grid container spacing={3}>

            {/* Start Date */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="date"
                label="Start Date"
                InputLabelProps={{ shrink: true }}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputProps={{
                  startAdornment: <DateRange sx={{ mr: 1 }} />,
                }}
              />
            </Grid>

            {/* End Date */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="date"
                label="End Date"
                InputLabelProps={{ shrink: true }}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                InputProps={{
                  startAdornment: <DateRange sx={{ mr: 1 }} />,
                }}
              />
            </Grid>

            {/* Employee Selector */}
            <Grid item xs={12}>
              <Select
                fullWidth
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                startAdornment={<Person sx={{ mr: 1 }} />}
              >
                <MenuItem value="all">All Employees</MenuItem>

                {employeeList.map((emp) => (
                  <MenuItem key={emp.id} value={emp.id}>
                    {emp.name} ({emp.empId})
                  </MenuItem>
                ))}
              </Select>
            </Grid>

            {/* ALERTS */}
            {alertMsg && (
              <Grid item xs={12}>
                <Alert severity={alertType}>{alertMsg}</Alert>
              </Grid>
            )}

            {/* DOWNLOAD BUTTON */}
            <Grid item xs={12}>
              <Button
                variant="contained"
                fullWidth
                size="large"
                startIcon={<Download />}
                onClick={handleExport}
                disabled={loading}
                sx={{ py: 1.5, fontSize: "1rem" }}
              >
                {loading ? "Generating..." : "Download Report as CSV"}
              </Button>
            </Grid>
          </Grid>

          <Box textAlign="center" sx={{ mt: 3 }}>
            <Button
              href="/manager/dashboard"
              startIcon={<ListAlt />}
              variant="text"
            >
              Back to Dashboard
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
