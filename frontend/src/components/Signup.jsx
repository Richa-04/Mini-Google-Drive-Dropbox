import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Container, Box, TextField, Button, Typography, Paper, Alert } from '@mui/material';

const Signup = () => {
    const [formData, setFormData] = useState({ 
        firstName: '', 
        lastName: '', 
        email: '', 
        password: '', 
        confirmPassword: '' 
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            const { firstName, lastName, email, password } = formData;
            await authService.signup({ firstName, lastName, email, password });
            // Don't auto-login, just redirect to login page
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Signup failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
                    <Typography variant="h4" align="center" gutterBottom>Mini Google Drive</Typography>
                    <Typography variant="h6" align="center" gutterBottom color="textSecondary">Create Account</Typography>

                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    <Box component="form" onSubmit={handleSubmit}>
                        <TextField 
                            fullWidth 
                            label="First Name" 
                            name="firstName" 
                            value={formData.firstName} 
                            onChange={handleChange} 
                            margin="normal" 
                            required 
                        />
                        <TextField 
                            fullWidth 
                            label="Last Name" 
                            name="lastName" 
                            value={formData.lastName} 
                            onChange={handleChange} 
                            margin="normal" 
                            required 
                        />
                        <TextField 
                            fullWidth 
                            label="Email" 
                            type="email" 
                            name="email" 
                            value={formData.email} 
                            onChange={handleChange} 
                            margin="normal" 
                            required 
                        />
                        <TextField 
                            fullWidth 
                            label="Password" 
                            type="password" 
                            name="password" 
                            value={formData.password} 
                            onChange={handleChange} 
                            margin="normal" 
                            required 
                        />
                        <TextField 
                            fullWidth 
                            label="Confirm Password" 
                            type="password" 
                            name="confirmPassword" 
                            value={formData.confirmPassword} 
                            onChange={handleChange} 
                            margin="normal" 
                            required 
                        />
                        <Button 
                            type="submit" 
                            fullWidth 
                            variant="contained" 
                            size="large" 
                            disabled={loading} 
                            sx={{ mt: 3, mb: 2 }}
                        >
                            {loading ? 'Creating Account...' : 'SIGN UP'}
                        </Button>

                        <Typography align="center">
                            Already have an account? <Link to="/login" style={{ textDecoration: 'none', color: '#1976d2' }}>Login</Link>
                        </Typography>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default Signup;