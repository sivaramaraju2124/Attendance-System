import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
    Container,
    Typography,
    Box,
    CircularProgress,
    Alert,
    Paper,
    Grid,
    Button,
    TextField,
    InputAdornment,
    Snackbar,
    Divider,
    Tab,
    Tabs,
    IconButton,
} from "@mui/material";
import {
    Person,
    Email,
    Fingerprint,
    Apartment,
    Lock,
    ExitToApp,
    VpnKey,
    Visibility,
    VisibilityOff,
    Security
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

// --- Profile Data Component ---
const UserDetailsCard = ({ user }) => (
    <motion.div variants={itemVariants} style={{ height: '100%' }}>
        <Paper elevation={4} sx={{ p: 4, borderRadius: 3, height: '100%', bgcolor: '#f5f5f5' }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: 'primary.main' }}>
                <Person sx={{ mr: 1, verticalAlign: 'middle' }} /> Account Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
                {[
                    { label: 'Full Name', value: user.name, icon: Person },
                    { label: 'Employee ID', value: user.employeeId, icon: Fingerprint },
                    { label: 'Email', value: user.email, icon: Email },
                    { label: 'Department', value: user.department, icon: Apartment },
                    { label: 'Role', value: user.role.toUpperCase(), icon: VpnKey },
                ].map((item, index) => (
                    <Grid item xs={12} key={index}>
                        <Box sx={{ display: 'flex', alignItems: 'center', p: 1, borderBottom: '1px solid #e0e0e0' }}>
                            <item.icon color="action" sx={{ mr: 2, fontSize: 18 }} />
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', minWidth: 100 }}>{item.label}:</Typography>
                            <Typography variant="body1">{item.value}</Typography>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Paper>
    </motion.div>
);

// --- Password Change Component ---
const PasswordChangeForm = () => {
    const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ open: false, severity: 'success', message: '' });
    const [showPassword, setShowPassword] = useState(false);

    const token = localStorage.getItem('token');

    const handleChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setAlert({ open: false, severity: 'success', message: '' });

        if (passwords.newPassword !== passwords.confirmNewPassword) {
            setAlert({ open: true, severity: 'error', message: 'New passwords do not match.' });
            setLoading(false);
            return;
        }

        try {
            // NOTE: This endpoint needs to be implemented in authController.js
            await axios.post("http://localhost:5000/api/auth/change-password", {
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword,
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setAlert({ open: true, severity: 'success', message: 'Password updated successfully!' });
            setPasswords({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
        } catch (err) {
            const msg = err.response?.data?.msg || "Failed to update password. Check current password.";
            setAlert({ open: true, severity: 'error', message: msg });
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <motion.div variants={itemVariants}>
            <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: 'error.main' }}>
                    <Security sx={{ mr: 1, verticalAlign: 'middle' }} /> Change Password
                </Typography>
                <Divider sx={{ mb: 3 }} />
                
                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <TextField
                        label="Current Password"
                        name="currentPassword"
                        type={showPassword ? "text" : "password"}
                        required
                        fullWidth
                        value={passwords.currentPassword}
                        onChange={handleChange}
                        InputProps={{
                            startAdornment: (<InputAdornment position="start"><Lock /></InputAdornment>),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={togglePasswordVisibility}>
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        label="New Password"
                        name="newPassword"
                        type="password"
                        required
                        fullWidth
                        value={passwords.newPassword}
                        onChange={handleChange}
                        helperText="Must be at least 8 characters long."
                    />
                    <TextField
                        label="Confirm New Password"
                        name="confirmNewPassword"
                        type="password"
                        required
                        fullWidth
                        value={passwords.confirmNewPassword}
                        onChange={handleChange}
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        color="error"
                        fullWidth
                        size="large"
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <ExitToApp />}
                        sx={{ mt: 2, py: 1.5, borderRadius: 2 }}
                    >
                        {loading ? "Updating..." : "Update Password"}
                    </Button>
                </Box>
            </Paper>

            <Snackbar 
                open={alert.open} 
                autoHideDuration={6000} 
                onClose={() => setAlert({ ...alert, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={() => setAlert({ ...alert, open: false })} severity={alert.severity} sx={{ width: '100%' }}>
                    {alert.message}
                </Alert>
            </Snackbar>
        </motion.div>
    );
};

// --- Main Profile Page Component ---
export default function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const token = localStorage.getItem('token');

    const fetchProfile = useCallback(async () => {
        if (!token) {
            navigate('/login');
            return;
        }
        try {
            // This API call requires the token and hits the endpoint defined for auth/me
            const res = await axios.get("http://localhost:5000/api/auth/me", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUser(res.data);
            
            // Ensure localStorage name is updated if profile page provides it
            localStorage.setItem('userName', res.data.name); 

        } catch (err) {
            console.error("Profile fetch error:", err);
            setError("Failed to load user profile. Please log in again.");
            if (err.response?.status === 401) {
                 localStorage.clear();
                 navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    }, [token, navigate]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    if (loading) {
        return <Box sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><CircularProgress /></Box>;
    }
    
    if (error) {
        return <Container sx={{ py: 5 }}><Alert severity="error">{error}</Alert></Container>;
    }
    
    // We only render the tabs/forms if the user data is loaded
    return (
        <Box sx={{ minHeight: "100vh", py: 5, backgroundColor: "#f4f6f8" }}>
            <Container maxWidth="lg">
                <motion.div variants={containerVariants} initial="hidden" animate="visible">
                    <Typography variant="h4" fontWeight="800" sx={{ color: '#1a237e', mb: 3 }}>
                        <Person sx={{ mr: 1, verticalAlign: 'middle' }} /> User Profile
                    </Typography>

                    <Grid container spacing={4}>
                        {/* Column 1: Profile Details */}
                        <Grid item xs={12} md={6}>
                            <UserDetailsCard user={user} />
                        </Grid>

                        {/* Column 2: Password Change Form */}
                        <Grid item xs={12} md={6}>
                            <PasswordChangeForm />
                        </Grid>
                    </Grid>
                </motion.div>
            </Container>
        </Box>
    );
}