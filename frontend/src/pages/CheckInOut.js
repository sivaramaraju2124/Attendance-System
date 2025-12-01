import api from "../api";
import { useState } from "react";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Alert,
} from "@mui/material";

export default function CheckInOut() {
  const token = localStorage.getItem("token");
  const [msg, setMsg] = useState("");

  const checkIn = async () => {
    try {
      const res = await api.post(
        "/api/attendance/checkin",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMsg(res.data.msg);
    } catch (err) {
      setMsg(err.response?.data?.msg || "Error");
    }
  };

  const checkOut = async () => {
    try {
      const res = await api.post(
        "/api/attendance/checkout",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMsg(res.data.msg);
    } catch (err) {
      setMsg(err.response?.data?.msg || "Error");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ marginTop: 5 }}>
      <Card elevation={4}>
        <CardContent>
          <Typography variant="h4" align="center" gutterBottom>
            Mark Attendance
          </Typography>

          <Box
            sx={{ display: "flex", flexDirection: "column", gap: 2, marginTop: 3 }}
          >
            <Button variant="contained" size="large" onClick={checkIn}>
              Check In
            </Button>

            <Button variant="outlined" size="large" onClick={checkOut}>
              Check Out
            </Button>

            {msg && <Alert severity="info">{msg}</Alert>}

            <Button variant="text" href="/employee/dashboard">
              Back to Dashboard
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
