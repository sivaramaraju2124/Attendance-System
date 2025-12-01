import axios from "axios";
import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TableContainer,
  Button,
  Grid,
  TextField,
  Select,
  MenuItem,
  Box,
  Chip,
  TablePagination,
  useTheme,
} from "@mui/material";

import { Search, FilterList, ListAlt } from "@mui/icons-material";
import { motion } from "framer-motion";

export default function ManagerAllEmployees() {
  const token = localStorage.getItem("token");
  const theme = useTheme();

  const [allRecords, setAllRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);

  const [filters, setFilters] = useState({
    employee: "",
    date: "",
    status: "All",
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await axios.get("http://localhost:5000/api/attendance/all", {
      headers: { Authorization: `Bearer ${token}` },
    });

    setAllRecords(res.data);
    setFilteredRecords(res.data);
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // Corrected applyFilters function
const applyFilters = () => {
    let data = [...allRecords];
    const e = filters.employee.toLowerCase().trim(); // Trim and lower-case search term once

    // --- 1. Employee Filter FIX ---
    if (e !== "") {
      data = data.filter((r) => {
        // Step 1: Ensure r.userId exists (check if population failed)
        if (!r.userId) return false;

        const userName = r.userId.name ? r.userId.name.toLowerCase() : "";
        const employeeId = r.userId.employeeId ? r.userId.employeeId.toLowerCase() : "";

        // Step 2: Check if name OR employeeId includes the search term
        return userName.includes(e) || employeeId.includes(e);
      });
    }
    // --- End Employee Filter FIX ---

    if (filters.date !== "") {
      data = data.filter((r) => r.date === filters.date);
    }

    if (filters.status !== "All") {
      data = data.filter((r) => r.status === filters.status.toLowerCase());
    }

    setFilteredRecords(data);
    setPage(0);
};

  const clearFilters = () => {
    setFilters({ employee: "", date: "", status: "All" });
    setFilteredRecords(allRecords);
  };

  const formatStatus = (status) => {
    switch (status) {
      case "present":
        return <Chip label="Present" color="success" />;
      case "absent":
        return <Chip label="Absent" color="error" />;
      case "late":
        return <Chip label="Late" color="warning" />;
      case "halfday":
        return (
          <Chip
            label="Half Day"
            sx={{ background: "#ff9800", color: "#fff" }}
          />
        );
      default:
        return status;
    }
  };

  const handleChangePage = (_, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(+e.target.value);
    setPage(0);
  };

  // Unique Employee List for dropdown
  const employeeList = [
    ...new Map(
      allRecords.map((r) => [
        r.userId?._id,
        { name: r.userId?.name, id: r.userId?.employeeId },
      ])
    ).values(),
  ];

  return (
    <Box sx={{ background: "#f4f6f8", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="xl">
        {/* HEADER */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1 }}>
          <Typography
            variant="h4"
            fontWeight="800"
            sx={{ color: "#1a237e", mb: 1 }}
          >
            Team Attendance Management
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 3 }}>
            Filter, search & review team attendance records easily
          </Typography>
        </motion.div>

        {/* FILTER BAR */}
        <Paper
          elevation={2}
          sx={{
            p: 2,
            mb: 3,
            position: "sticky",
            top: 10,
            zIndex: 10,
            borderRadius: 3,
          }}
          component={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Grid container spacing={2} alignItems="center">
            {/* Employee Filter */}
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Search by Name or Employee ID"
                name="employee"
                value={filters.employee}
                onChange={handleFilterChange}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1 }} />,
                }}
              />
            </Grid>

            {/* Date Filter */}
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                type="date"
                label="Filter by Date"
                InputLabelProps={{ shrink: true }}
                name="date"
                value={filters.date}
                onChange={handleFilterChange}
              />
            </Grid>

            {/* Status Filter */}
            <Grid item xs={12} md={3}>
              <Select
                fullWidth
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="Present">Present</MenuItem>
                <MenuItem value="Absent">Absent</MenuItem>
                <MenuItem value="Late">Late</MenuItem>
                <MenuItem value="Half-Day">Half Day</MenuItem>
              </Select>
            </Grid>

            {/* Buttons */}
            <Grid item xs={12} md={2}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<FilterList />}
                onClick={applyFilters}
                sx={{ mb: 1 }}
              >
                Apply
              </Button>

              <Button
                variant="outlined"
                fullWidth
                onClick={clearFilters}
              >
                Clear
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* TABLE */}
        <TableContainer
          component={Paper}
          elevation={4}
          sx={{ borderRadius: 3 }}
          component1={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell><b>Name</b></TableCell>
                <TableCell><b>Employee ID</b></TableCell>
                <TableCell><b>Department</b></TableCell>
                <TableCell><b>Date</b></TableCell>
                <TableCell><b>Check In</b></TableCell>
                <TableCell><b>Check Out</b></TableCell>
                <TableCell><b>Total Hours</b></TableCell>
                <TableCell><b>Status</b></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredRecords
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((r) => (
                  <TableRow key={r._id} hover>
                    <TableCell>{r.userId?.name}</TableCell>
                    <TableCell>{r.userId?.employeeId}</TableCell>
                    <TableCell>{r.userId?.department}</TableCell>
                    <TableCell>{r.date}</TableCell>
                    <TableCell>{r.checkInTime || "-"}</TableCell>
                    <TableCell>{r.checkOutTime || "-"}</TableCell>
                    <TableCell>
                      {(r.totalHours || 0).toFixed(2)} hrs
                    </TableCell>
                    <TableCell>{formatStatus(r.status)}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>

          {/* PAGINATION */}
          <TablePagination
            component="div"
            count={filteredRecords.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[10, 20, 50]}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>

        {/* BACK BUTTON */}
        <Button
          variant="text"
          href="/manager/dashboard"
          sx={{ mt: 2 }}
          startIcon={<ListAlt />}
        >
          Back to Dashboard
        </Button>
      </Container>
    </Box>
  );
}
