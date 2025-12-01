import api from "../api";
import { useEffect, useState, useCallback } from "react"; 
import { useNavigate } from "react-router-dom"; 
import {
    Container,
    Typography,
    Card,
    CardContent,
    Grid,
    Button,
    Box,
    CircularProgress,
    Alert,
    useTheme,
    Divider,
    Paper
} from "@mui/material";
import {
    AccessTime,
    DirectionsRun,
    ExitToApp,
    Input,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';

// --- Configuration ---
const PIE_COLORS = ['#4caf50', '#f44336', '#ff9800', '#2196f3'];

// Animation Variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

// --- Helper to format time ---
const formatTime = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString); 
    return isNaN(date.getTime()) 
        ? null 
        : date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
};

// --- CORE COMPONENT ---
export default function EmployeeDashboard() {
    const theme = useTheme();
    const navigate = useNavigate();
    
    // State management for data
    const [summary, setSummary] = useState({ present: 0, absent: 0, late: 0, halfday: 0, totalHours: '0.00' });
    const [weeklyHistory, setWeeklyHistory] = useState([]);
    const [todayRecord, setTodayRecord] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [userName, setUserName] = useState("Employee"); 

    // --- Data Fetching (FIXED LOGIC) ---
    const fetchData = useCallback(async () => {
        const localToken = localStorage.getItem("token");
        if (!localToken) { navigate('/login'); return; }

        setLoading(true);
        
        try {
            const headers = { Authorization: `Bearer ${localToken}` };
            const [summaryRes, historyRes, profileRes] = await Promise.all([
                api.get("/api/attendance/my-summary", { headers }),
                api.get("/api/attendance/my-history", { headers }),
                api.get("/api/auth/me", { headers }),
            ]);

            setUserName(profileRes.data.name || "Employee");
            setSummary(summaryRes.data);

            const today = new Date().toISOString().slice(0, 10);
            // Index history data by date string for easy lookup
            const indexedHistory = historyRes.data.reduce((acc, r) => {
                acc[r.date.slice(0, 10)] = r;
                return acc;
            }, {});

            setTodayRecord(indexedHistory[today]);

            // --- Weekly Chart Data Generation (FIXED) ---
            const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const lastSevenDays = [];
            const todayIndex = new Date().getDay(); // 0 for Sunday, 6 for Saturday

            for (let i = 6; i >= 0; i--) {
                const date = new Date();
                date.setDate(date.getDate() - i); // Go back i days from today
                
                const dateKey = date.toISOString().slice(0, 10);
                const dayLabel = daysOfWeek[date.getDay()]; // Get the correct day name

                const record = indexedHistory[dateKey];
                const hours = record ? (parseFloat(record.totalHours) > 0 ? parseFloat(record.totalHours) : 0) : 0;
                
                lastSevenDays.push({ 
                    day: dayLabel, 
                    hours: hours 
                });
            }
            
            setWeeklyHistory(lastSevenDays);
            // ---------------------------------------------

        } catch (err) {
            console.error("Dashboard Fetch Error:", err);
            if (err.response?.status === 401) {
                localStorage.removeItem('token');
                navigate('/login');
            }
            setError("Failed to sync data. Please check the backend service.");
        } finally {
            setLoading(false);
        }
    }, [navigate]); 

    useEffect(() => { fetchData(); }, [fetchData]);

    // --- Check-in/Check-out Handler ---
    const handleCheckAction = async (actionType) => {
        setActionLoading(true);
        const localToken = localStorage.getItem("token");
        try {
            await api.post(`/api/attendance/${actionType}`, {}, {
                headers: { Authorization: `Bearer ${localToken}` },
            });
            // Re-fetch data to update the status immediately
            await fetchData(); 
        } catch (err) {
            alert(`Attendance ${actionType} failed. Error: ${err.response?.data?.message || 'Server error'}`);
            console.error(err);
        } finally {
            setActionLoading(false);
        }
    };

    // --- Status Logic ---
    const getStatusInfo = () => {
        // Checked In, Not Checked Out
        if (todayRecord?.checkInTime && !todayRecord?.checkOutTime) {
            return { 
                status: "Checked In", 
                color: theme.palette.success.main, 
                icon: <DirectionsRun sx={{ fontSize: 40 }} />, 
                action: { label: "Check Out", type: "checkout" } 
            };
        } 
        // Checked Out
        else if (todayRecord?.checkOutTime) {
            return { 
                status: "Finished Day", 
                color: theme.palette.info.main, 
                icon: <Input sx={{ fontSize: 40, transform: 'scaleX(-1)' }} />,
                action: null 
            };
        } 
        // Not Checked In Yet
        else {
            return { 
                status: "Ready to Start", 
                color: theme.palette.warning.main, 
                icon: <AccessTime sx={{ fontSize: 40 }} />, 
                action: { label: "Check In", type: "checkin" } 
            };
        }
    };

    const statusInfo = getStatusInfo();
    
    // Pie Chart Data
    const pieData = [
        { name: 'Present', value: summary.present || 0, color: PIE_COLORS[0] },
        { name: 'Absent', value: summary.absent || 0, color: PIE_COLORS[1] },
        { name: 'Late', value: summary.late || 0, color: PIE_COLORS[2] },
        { name: 'Half Day', value: summary.halfday || 0, color: PIE_COLORS[3] },
    ].filter(item => item.value > 0); 

    if (loading) return <Box sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><CircularProgress /></Box>;

    return (
        <Box sx={{ minHeight: "100vh", pb: 5, backgroundColor: "#f4f6f8" }}>
            <Container maxWidth="lg" sx={{ pt: 4, px: { xs: 2, lg: 5 } }}>
                
                {/* Header */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" fontWeight="800" sx={{ color: '#1a237e' }}>
                        Welcome, {userName}!
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Here is your attendance overview for the current month.
                    </Typography>
                </Box>

                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                <motion.div variants={containerVariants} initial="hidden" animate="visible">
                    <Grid container spacing={3} alignItems="stretch">
                        
                        {/* Row 1: Cards (3 + 5 + 4 = 12) */}
                        <Grid item xs={12} lg={12}>
                            <Grid container spacing={3} alignItems="stretch">

                                {/* 1. STATUS CARD */}
                                <Grid item xs={12} sm={4} lg={3}>
                                    <motion.div variants={itemVariants} style={{ height: '100%' }}>
                                        <Card elevation={4} sx={{ borderRadius: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', textAlign: 'center', p: 3 }}>
                                            
                                            <Box>
                                                <Box sx={{ width: 80, height: 80, borderRadius: '50%', bgcolor: `${statusInfo.color}15`, color: statusInfo.color, display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
                                                    {statusInfo.icon}
                                                </Box>
                                                <Typography variant="h5" fontWeight="bold" sx={{ color: statusInfo.color }}>
                                                    {statusInfo.status}
                                                </Typography>

                                                {/* Display times clearly */}
                                                {todayRecord?.checkInTime && formatTime(todayRecord.checkInTime) && (
                                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                                        Check In: **{formatTime(todayRecord.checkInTime)}**
                                                    </Typography>
                                                )}
                                                {todayRecord?.checkOutTime && formatTime(todayRecord.checkOutTime) && (
                                                    <Typography variant="body2" color="text.secondary">
                                                        Check Out: **{formatTime(todayRecord.checkOutTime)}**
                                                    </Typography>
                                                )}
                                            </Box>
                                            
                                            {statusInfo.action && (
                                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                                    <Button 
                                                        variant="contained" 
                                                        color={statusInfo.action.type === 'checkin' ? 'success' : 'error'}
                                                        onClick={() => handleCheckAction(statusInfo.action.type)}
                                                        disabled={actionLoading}
                                                        startIcon={statusInfo.action.type === 'checkin' ? <Input /> : <ExitToApp />}
                                                        sx={{ mt: 3, borderRadius: 2, py: 1.5, textTransform: 'uppercase', fontWeight: 'bold' }}
                                                        fullWidth
                                                    >
                                                        {actionLoading ? <CircularProgress size={24} color="inherit" /> : statusInfo.action.label}
                                                    </Button>
                                                </motion.div>
                                            )}
                                        </Card>
                                    </motion.div>
                                </Grid>

                                {/* 2. MONTHLY SUMMARY */}
                                <Grid item xs={12} sm={8} lg={5}>
                                    <motion.div variants={itemVariants} style={{ height: '100%' }}>
                                        <Card elevation={4} sx={{ borderRadius: 3, height: '100%', p: 3 }}>
                                            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: '#1a237e' }}>
                                                Monthly Overview
                                            </Typography>
                                            <Divider sx={{ mb: 2 }} />
                                            
                                            <Grid container spacing={2} alignItems="center">
                                                
                                                {/* Left Side: Stats Numbers */}
                                                <Grid item xs={12} sm={6}>
                                                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
                                                        <StatBox label="Present" value={summary.present} color="success.main" />
                                                        <StatBox label="Absent" value={summary.absent} color="error.main" />
                                                        <StatBox label="Late" value={summary.late} color="warning.main" />
                                                        {/* FIX: Robust parsing for totalHours */}
                                                        <StatBox 
                                                            label="Total Hrs" 
                                                            value={parseFloat(summary.totalHours || '0').toFixed(2)} 
                                                            color="primary.main" 
                                                        />
                                                    </Box>
                                                </Grid>

                                                {/* Right Side: Pie Chart */}
                                                <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'center' }}>
                                                    <Box sx={{ width: '100%', height: 180 }}>
                                                        <ResponsiveContainer>
                                                            <PieChart>
                                                                <Pie
                                                                    data={pieData}
                                                                    innerRadius={60}
                                                                    outerRadius={85}
                                                                    paddingAngle={3}
                                                                    dataKey="value"
                                                                    startAngle={90}
                                                                    endAngle={-270}
                                                                >
                                                                    {pieData.map((entry, index) => (
                                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                                    ))}
                                                                </Pie>
                                                                <Tooltip formatter={(value, name) => [`${value} days`, name]} />
                                                            </PieChart>
                                                        </ResponsiveContainer>
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                        </Card>
                                    </motion.div>
                                </Grid>

                                {/* 3. WEEKLY CHART */}
                                <Grid item xs={12} lg={4}>
                                    <motion.div variants={itemVariants} style={{ height: '100%' }}>
                                        <Card elevation={4} sx={{ borderRadius: 3, height: '100%', p: 3 }}>
                                            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: '#1a237e' }}>
                                                Weekly Hours Trend
                                            </Typography>
                                            <Divider sx={{ mb: 2 }} />
                                            <Box sx={{ flexGrow: 1, minHeight: 180, height: '180px' }}> 
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <BarChart data={weeklyHistory} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                                                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                                                        <Tooltip 
                                                            cursor={{fill: theme.palette.primary.light, opacity: 0.1}} 
                                                            formatter={(value) => [`${parseFloat(value).toFixed(1)} hours`, 'Worked']} 
                                                        />
                                                        <Bar dataKey="hours" fill={theme.palette.primary.main} radius={[4, 4, 0, 0]} barSize={25} />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </Box>
                                        </Card>
                                    </motion.div>
                                </Grid>

                            </Grid>
                        </Grid>
                        
                    </Grid>
                </motion.div>
            </Container>
        </Box>
    );
}

// --- Components (Helper functions to be defined outside the main component) ---

const StatBox = ({ label, value, color }) => (
    <Paper 
        elevation={2} 
        sx={{ 
            textAlign: 'center', 
            p: 1.5, 
            borderRadius: 2, 
            borderLeft: `5px solid ${color}`,
            transition: 'transform 0.3s',
            '&:hover': { transform: 'translateY(-2px)' }
        }}
    >
        <Typography variant="h5" fontWeight="bold" sx={{ color }}>{value}</Typography>
        <Typography variant="caption" color="text.secondary">{label}</Typography>
    </Paper>
);

const NavButton = ({ label, icon, onClick, secondary }) => (
    <Button 
        variant="contained" 
        onClick={onClick}
        startIcon={icon}
        color={secondary ? "secondary" : "primary"}
        sx={{ 
            px: 3, py: 1.5, 
            borderRadius: 2, 
            textTransform: 'none', 
            fontSize: '1rem',
            fontWeight: 'bold',
            minWidth: 180,
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}
    >
        {label}
    </Button>
);
