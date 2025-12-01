import axios from "axios";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
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
    Box,
    CircularProgress,
    Alert,
    useTheme,
    Grid,
    IconButton,
    Tooltip,
    Divider
} from "@mui/material";
import {
    ChevronLeft,
    ChevronRight,
    CalendarToday,
    CheckCircle,
    Cancel,
    TimerOff,
    Schedule,
    ListAlt,
} from "@mui/icons-material";
import { motion } from "framer-motion";

// --- Configuration for Status Colors/Icons ---
const STATUS_CONFIG = {
    present: { color: "#4caf50", icon: <CheckCircle fontSize="small" />, label: "Present" },
    absent: { color: "#f44336", icon: <Cancel fontSize="small" />, label: "Absent" },
    late: { color: "#ff9800", icon: <TimerOff fontSize="small" />, label: "Late" },
    'half-day': { color: "#ff5722", icon: <Schedule fontSize="small" />, label: "Half Day" },
    default: { color: "#757575", icon: <Schedule fontSize="small" />, label: "Pending" }
};

// --- Helper Functions ---
// CRITICAL FIX: Helper to format date object into YYYY-MM-DD local string (SOLVES DAY OFFSET BUG)
const toLocalISOString = (date) => {
    return date.getFullYear() + '-' + 
           String(date.getMonth() + 1).padStart(2, '0') + '-' + 
           String(date.getDate()).padStart(2, '0');
};

const formatDateTime = (isoString, type) => {
    if (!isoString) return "-";
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "-";
    
    if (type === 'date') {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
    if (type === 'time') {
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }
    return "-";
};

// --- Component: Attendance Calendar (DATE MAPPING FIX) ---
const AttendanceCalendar = ({ attendanceMap, month, setMonth }) => {
    const theme = useTheme();
    const today = new Date();
    const currentYear = today.getFullYear();
    
    const firstDayOfMonth = new Date(currentYear, month, 1);
    const numDays = new Date(currentYear, month + 1, 0).getDate();
    const startingDay = firstDayOfMonth.getDay(); 
    
    const calendarDays = useMemo(() => {
        let days = [];
        for (let i = 0; i < startingDay; i++) {
            days.push({ key: `empty-${i}`, date: null });
        }
        for (let day = 1; day <= numDays; day++) {
            // CRITICAL FIX: Use local date string for consistent key mapping
            const dateObj = new Date(currentYear, month, day);
            const dateKey = toLocalISOString(dateObj); 
            
            const isCurrentToday = toLocalISOString(today) === dateKey;

            days.push({ 
                key: dateKey, 
                date: day, 
                record: attendanceMap[dateKey],
                isToday: isCurrentToday
            });
        }
        return days;
    }, [month, numDays, startingDay, today, attendanceMap, currentYear]);


    const handleMonthChange = (direction) => {
        setMonth(prev => prev + direction);
    };

    return (
        <Paper elevation={4} sx={{ p: 3, borderRadius: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">
                    {firstDayOfMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </Typography>
                <Box>
                    <IconButton onClick={() => handleMonthChange(-1)} size="small"><ChevronLeft /></IconButton>
                    <IconButton onClick={() => setMonth(today.getMonth())} size="small" color="primary"><CalendarToday fontSize="small" /></IconButton>
                    <IconButton onClick={() => handleMonthChange(1)} size="small"><ChevronRight /></IconButton>
                </Box>
            </Box>

            {/* Days of the Week Header */}
            <Grid container spacing={0.5}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <Grid item xs={12/7} key={day} sx={{ textAlign: 'center', mb: 1 }}>
                        <Typography variant="caption" fontWeight="bold" color="text.secondary">{day}</Typography>
                    </Grid>
                ))}
            </Grid>
            <Divider sx={{ mb: 1 }} />

            {/* Calendar Days Grid */}
            <Grid container spacing={1}>
                {calendarDays.map((day, index) => {
                    if (!day.date) {
                        return <Grid item xs={12/7} key={day.key} sx={{ minHeight: 45 }} />;
                    }
                    
                    const status = day.record?.status?.toLowerCase() || 'default';
                    const config = STATUS_CONFIG[status] || STATUS_CONFIG.default;

                    const tooltipTitle = day.record 
                        ? `${config.label}\nCheck In: ${formatDateTime(day.record.checkInTime, 'time')}\nHours: ${day.record.totalHours || '0.00'}`
                        : 'No record';

                    return (
                        // MINIMALIST LAYOUT FIX: Rely on padding and minHeight
                        <Grid item xs={12/7} key={day.key} sx={{ minHeight: 45 }}> 
                            <Tooltip title={<Typography whiteSpace="pre-wrap">{tooltipTitle}</Typography>} arrow>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ height: '100%' }}>
                                    <Box 
                                        sx={{ 
                                            p: 1, // Controls size (compact)
                                            borderRadius: 2, 
                                            textAlign: 'center', 
                                            bgcolor: day.record ? `${config.color}15` : '#f5f5f5', 
                                            border: day.isToday ? `2px solid ${theme.palette.primary.main}` : '1px solid #e0e0e0',
                                            cursor: 'pointer',
                                            // FIX: Ensure icon and text stack cleanly
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center', 
                                            alignItems: 'center',
                                            minHeight: 45 // Ensures minimum height
                                        }}
                                    >
                                        <Typography variant="body2" fontWeight="bold" sx={{ color: day.record ? config.color : 'text.primary', fontSize: '0.9rem' }}>
                                            {day.date}
                                        </Typography>
                                        {day.record && (
                                            <Box sx={{ mt: 0.2, color: config.color, fontSize: '0.7rem' }}>
                                                {config.icon}
                                            </Box>
                                        )}
                                    </Box>
                                </motion.div>
                            </Tooltip>
                        </Grid>
                    );
                })}
            </Grid>
        </Paper>
    );
};


// --- Main Component ---
export default function History() {
    const navigate = useNavigate();
    const theme = useTheme();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [month, setMonth] = useState(new Date().getMonth()); // Current month index

    const token = localStorage.getItem("token");

    const fetchHistory = useCallback(async () => {
        if (!token) { navigate('/login'); return; }
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get("http://localhost:5000/api/attendance/my-history", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setHistory(res.data);
        } catch (err) {
            console.error(err);
            setError("Failed to load attendance history.");
        } finally {
            setLoading(false);
        }
    }, [token, navigate]);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    // Convert history array to a map for easy calendar lookup: {'YYYY-MM-DD': record}
    const attendanceMap = useMemo(() => {
        return history.reduce((acc, record) => {
            // FIX: Use the local date helper function for correct key mapping
            const dateObj = new Date(record.date);
            const dateKey = toLocalISOString(dateObj); 
            acc[dateKey] = record;
            return acc;
        }, {});
    }, [history]);
    
    // Filter table data based on the selected month
    const filteredHistory = useMemo(() => {
        return history.filter(h => {
            const recordMonth = new Date(h.date).getMonth();
            return recordMonth === month;
        }).sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date descending
    }, [history, month]);


    if (loading) {
        return <Box sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><CircularProgress /></Box>;
    }
    
    return (
        <Box sx={{ minHeight: "100vh", py: 5, backgroundColor: "#f4f6f8" }}>
            <Container maxWidth="lg">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h4" fontWeight="800" sx={{ color: '#1a237e' }}>
                            <CalendarToday sx={{ mr: 1, verticalAlign: 'middle' }} /> My Attendance History
                        </Typography>
                        <Button
                            variant="outlined"
                            onClick={() => navigate("/employee/dashboard")}
                            startIcon={<ListAlt />}
                            sx={{ textTransform: 'none', borderRadius: 2 }}
                        >
                            Back to Dashboard
                        </Button>
                    </Box>

                    {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
                    
                    {/* 1. CALENDAR VIEW */}
                    <motion.div initial={{ y: 20 }} animate={{ y: 0, transition: { delay: 0.1 } }}>
                        <AttendanceCalendar attendanceMap={attendanceMap} month={month} setMonth={setMonth} />
                    </motion.div>


                    {/* 2. TABLE VIEW (for detailed data of the selected month) */}
                    <Typography variant="h5" fontWeight="bold" sx={{ mt: 5, mb: 2 }}>
                        Monthly Detailed Records
                    </Typography>
                    
                    {filteredHistory.length === 0 ? (
                         <Alert severity="info" sx={{ mt: 2 }}>
                            No attendance records found for this month.
                        </Alert>
                    ) : (
                        <motion.div initial={{ y: 20 }} animate={{ y: 0, transition: { delay: 0.2 } }}>
                            <TableContainer component={Paper} elevation={4} sx={{ borderRadius: 3, overflow: 'hidden' }}>
                                <Table stickyHeader>
                                    <TableHead>
                                        <TableRow sx={{ bgcolor: theme.palette.primary.main }}>
                                            {['Date', 'Check In', 'Check Out', 'Status', 'Total Hours'].map((head, index) => (
                                                <TableCell 
                                                    key={index}
                                                    sx={{ fontWeight: 'bold', color: 'white', backgroundColor: theme.palette.primary.dark }}
                                                >
                                                    {head}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>

                                    <TableBody>
                                        {filteredHistory.map((h) => {
                                            const status = h.status?.toLowerCase() || 'default';
                                            const config = STATUS_CONFIG[status] || STATUS_CONFIG.default;
                                            return (
                                                <TableRow key={h._id} hover>
                                                    <TableCell>{formatDateTime(h.date, 'date')}</TableCell>
                                                    <TableCell>{formatDateTime(h.checkInTime, 'time')}</TableCell>
                                                    <TableCell>{formatDateTime(h.checkOutTime, 'time')}</TableCell>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', color: config.color, fontWeight: 'bold' }}>
                                                            {config.icon}
                                                            <span style={{ marginLeft: 8 }}>{config.label}</span>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>{h.totalHours ? `${parseFloat(h.totalHours).toFixed(2)} hrs` : '-'}</TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </motion.div>
                    )}
                </motion.div>
            </Container>
        </Box>
    );
}