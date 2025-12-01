import api from "../api";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    Box,
    Button,
    CircularProgress,
    Alert,
    useTheme,
    Divider,
} from "@mui/material";
import {
    EventAvailable,
    EventBusy,
    Schedule,
    AccessTime,
    AccessAlarms,
    ListAlt,
} from "@mui/icons-material";
import { motion } from "framer-motion";

// Animation Variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

// Statistic Card
const StatCard = ({ title, value, color, icon: IconComponent, unit = 'Days' }) => (
    <motion.div variants={itemVariants} style={{ height: '100%' }}>
        <Card 
            elevation={4} 
            sx={{ 
                borderRadius: 3, 
                borderLeft: `8px solid ${color}`,
                transition: 'transform 0.3s',
                '&:hover': { transform: 'translateY(-3px)', boxShadow: 6 },
                height: '100%',
            }}
        >
            <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 3 }}>
                <Box>
                    <Typography 
                        variant="subtitle2" 
                        fontWeight="bold" 
                        color="text.secondary" 
                        gutterBottom
                    >
                        {title}
                    </Typography>
                    <Typography variant="h4" fontWeight="800" sx={{ color: color }}>
                        {value === null || value === undefined ? '-' : value}
                        {unit === 'Hours' ? 'h' : ''}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {unit}
                    </Typography>
                </Box>
                <Box sx={{ color: color, opacity: 0.7 }}>
                    <IconComponent sx={{ fontSize: 48 }} />
                </Box>
            </CardContent>
        </Card>
    </motion.div>
);

export default function Summary() {
    const theme = useTheme();
    const navigate = useNavigate();
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem("token");

    const fetchSummary = useCallback(async () => {
        if (!token) { navigate('/login'); return; }
        setLoading(true);
        setError(null);
        try {
            const res = await api.get("/api/attendance/my-summary", {
                headers: { Authorization: `Bearer ${token}` }
            });

            const data = res.data;
            data.totalHours = data.totalHours ? parseFloat(data.totalHours).toFixed(2) : '0.00';
            setSummary(data);

        } catch (err) {
            console.error("Summary Fetch Error:", err);
            setError("Failed to load monthly summary. Please check API endpoint.");
        } finally {
            setLoading(false);
        }
    }, [token, navigate]);

    useEffect(() => {
        fetchSummary();
    }, [fetchSummary]);

    if (loading) {
        return <Box sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><CircularProgress /></Box>;
    }

    if (error) {
        return <Container sx={{ py: 5 }}><Alert severity="error">{error}</Alert></Container>;
    }

    const summaryData = [
        { title: 'Present Days', key: 'present', icon: EventAvailable, color: theme.palette.success.main, value: summary?.present || 0, unit: 'Days' },
        { title: 'Absent Days', key: 'absent', icon: EventBusy, color: theme.palette.error.main, value: summary?.absent || 0, unit: 'Days' },
        { title: 'Late Arrivals', key: 'late', icon: Schedule, color: theme.palette.warning.main, value: summary?.late || 0, unit: 'Days' },
        { title: 'Half Days', key: 'halfday', icon: AccessAlarms, color: theme.palette.secondary.main, value: summary?.halfday || 0, unit: 'Days' },
    ];

    return (
        <Box sx={{ minHeight: "100vh", py: 5, backgroundColor: "#f4f6f8" }}>
            <Container maxWidth="lg">
                <motion.div variants={containerVariants} initial="hidden" animate="visible">
                    
                    <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h4" fontWeight="800" sx={{ color: '#1a237e' }}>
                            <AccessTime sx={{ mr: 1, verticalAlign: 'middle' }} /> Monthly Attendance Summary
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

                    <Grid container spacing={4} sx={{ mb: 4 }}>
                        {summaryData.map(item => (
                            <Grid item xs={12} sm={6} lg={3} key={item.key}>
                                <StatCard {...item} />
                            </Grid>
                        ))}
                    </Grid>

                    <Divider sx={{ my: 3 }} />
                    
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={6}>
                            <motion.div variants={itemVariants}>
                                <Card elevation={4} sx={{ borderRadius: 3, borderLeft: `8px solid ${theme.palette.info.main}` }}>
                                    <CardContent sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Box>
                                            <Typography variant="h5" fontWeight="bold" gutterBottom>
                                                Total Hours Worked
                                            </Typography>
                                            <Typography variant="h3" fontWeight="800" sx={{ color: theme.palette.info.main, mt: 1 }}>
                                                {summary?.totalHours || '0.00'} hrs
                                            </Typography>
                                        </Box>
                                        <AccessTime sx={{ fontSize: 60, color: theme.palette.info.main, opacity: 0.7 }} />
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </Grid>
                    </Grid>
                    
                </motion.div>
            </Container>
        </Box>
    );
}
