import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Button, Paper } from '@mui/material';

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <Container>
            <Box sx={{ mt: 4 }}>
                <Paper elevation={2} sx={{ p: 3 }}>
                    <Typography variant="h4" gutterBottom>Welcome to Dashboard</Typography>
                    <Typography variant="h6" color="textSecondary">Hello, {user?.username || user?.email}!</Typography>
                    <Button variant="contained" color="secondary" onClick={handleLogout} sx={{ mt: 2 }}>Logout</Button>
                </Paper>

                <Paper elevation={2} sx={{ p: 3, mt: 3 }}>
                    <Typography variant="h6">📁 Your Files</Typography>
                    <Typography color="textSecondary">File upload feature coming soon...</Typography>
                </Paper>
            </Box>
        </Container>
    );
};

export default Dashboard;