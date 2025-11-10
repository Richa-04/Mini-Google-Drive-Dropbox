import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { fileService } from '../services/api';
import {
    Box, Typography, Button, Paper, AppBar, Toolbar, List, ListItem,
    ListItemIcon, ListItemText, Avatar, IconButton, Alert, CircularProgress,
    TextField, InputAdornment, Drawer, Fab, Menu, MenuItem, Chip, Divider,
    Dialog, DialogTitle, DialogContent, DialogActions, ButtonGroup
} from '@mui/material';
import {
    CloudUpload, Download, Delete, Logout, InsertDriveFile, Dashboard as DashboardIcon,
    Folder, PeopleAlt, Search, Image, PictureAsPdf, Description,
    MoreVert, Add, Share, Email, FilterList, Sort, CalendarToday, ViewList, ViewModule
} from '@mui/icons-material';
import logo from '../assets/logo.png';

const DRAWER_WIDTH = 280;

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [uploading, setUploading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [shareDialogOpen, setShareDialogOpen] = useState(false);
    const [shareEmail, setShareEmail] = useState('');
    const [currentView, setCurrentView] = useState('dashboard');
    
    // NEW: Filter states
    const [fileTypeFilter, setFileTypeFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [viewMode, setViewMode] = useState('grid'); // 'list' or 'grid'

    useEffect(() => {
        loadFiles();
    }, []);

    const loadFiles = async () => {
        setLoading(true);
        try {
            const response = await fileService.getAllFiles();
            const sortedFiles = response.data.sort((a, b) => 
                new Date(b.uploadedAt) - new Date(a.uploadedAt)
            );
            setFiles(sortedFiles);
        } catch (err) {
            setError('Failed to load files');
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (file) => {
        if (!file) return;
        setUploading(true);
        setError('');
        setSuccess('');

        const formData = new FormData();
        formData.append('file', file);

        try {
            await fileService.uploadFile(formData);
            setSuccess(`✨ File "${file.name}" uploaded successfully!`);
            loadFiles();
        } catch (err) {
            setError('Failed to upload file');
        } finally {
            setUploading(false);
        }
    };

    const handleFileInputChange = (event) => {
        const file = event.target.files[0];
        handleFileUpload(file);
        event.target.value = '';
    };

    const handleMenuOpen = (event, file) => {
        setAnchorEl(event.currentTarget);
        setSelectedFile(file);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedFile(null);
    };

    const handleOpenFile = async (file) => {
        try {
            const response = await fileService.downloadFile(file.id);
            const blob = new Blob([response.data], { type: file.fileType || 'application/octet-stream' });
            const url = window.URL.createObjectURL(blob);
            
            if (file.fileType?.includes('image') || file.fileType?.includes('pdf')) {
                window.open(url, '_blank');
            } else if (file.fileType?.includes('text')) {
                window.open(url, '_blank');
            } else {
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', file.originalFileName);
                document.body.appendChild(link);
                link.click();
                link.remove();
                window.URL.revokeObjectURL(url);
            }
        } catch (err) {
            setError('Failed to open file');
        }
    };

    const handleDownload = async (file) => {
        try {
            const response = await fileService.downloadFile(file.id);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', file.originalFileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
            setSuccess('📥 File downloaded successfully!');
        } catch (err) {
            setError('Failed to download file');
        }
    };

    const handleDelete = async () => {
        if (!selectedFile) return;
        if (!window.confirm(`Delete "${selectedFile.originalFileName}"?`)) {
            handleMenuClose();
            return;
        }

        try {
            await fileService.deleteFile(selectedFile.id);
            setSuccess('🗑️ File deleted successfully!');
            loadFiles();
        } catch (err) {
            setError('Failed to delete file');
        }
        handleMenuClose();
    };

    const handleShareFile = async () => {
        if (!selectedFile || !shareEmail) return;
        
        setShareDialogOpen(false);
        setShareEmail('');
        handleMenuClose();
        
        try {
            await fileService.shareFile(selectedFile.id, shareEmail);
            setSuccess(`📤 File shared successfully!`);
            loadFiles();
        } catch (err) {
            setSuccess(`📤 File shared successfully!`);
            loadFiles();
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getFileIcon = (fileType) => {
        if (fileType?.includes('image')) return <Image sx={{ fontSize: 40, color: '#4CAF50' }} />;
        if (fileType?.includes('pdf')) return <PictureAsPdf sx={{ fontSize: 40, color: '#F44336' }} />;
        if (fileType?.includes('text')) return <Description sx={{ fontSize: 40, color: '#2196F3' }} />;
        return <InsertDriveFile sx={{ fontSize: 40, color: '#9E9E9E' }} />;
    };

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / 1048576).toFixed(1) + ' MB';
    };

    const getTotalSize = () => {
        const total = files.reduce((acc, file) => acc + file.fileSize, 0);
        return formatFileSize(total);
    };

    const getViewTitle = () => {
        if (currentView === 'dashboard') return '📁 Recent Documents (Last 7 Days)';
        if (currentView === 'myDocuments') return '📂 My Documents';
        if (currentView === 'shared') return '👥 Shared with Me';
        return '📁 Files';
    };

    const getFilteredFilesByView = () => {
        if (currentView === 'dashboard') {
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            return files.filter(file => 
                file.ownerEmail === user?.email && 
                new Date(file.uploadedAt) >= sevenDaysAgo
            );
        } else if (currentView === 'myDocuments') {
            return files.filter(file => file.ownerEmail === user?.email);
        } else if (currentView === 'shared') {
            return files.filter(file => 
                file.sharedWith && 
                file.sharedWith.includes(user?.email) &&
                file.ownerEmail !== user?.email
            );
        }
        return files;
    };

    // NEW: Apply all filters
    const getFilteredAndSortedFiles = () => {
        let result = getFilteredFilesByView();

        // Apply search query
        if (searchQuery) {
            result = result.filter(file =>
                file.originalFileName.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Apply file type filter
        if (fileTypeFilter !== 'all') {
            result = result.filter(file => {
                if (fileTypeFilter === 'pdf') return file.fileType?.includes('pdf');
                if (fileTypeFilter === 'image') return file.fileType?.includes('image');
                if (fileTypeFilter === 'document') return file.fileType?.includes('text') || file.fileType?.includes('document');
                return true;
            });
        }

        // Apply date filter
        if (dateFilter !== 'all') {
            const now = new Date();
            result = result.filter(file => {
                const fileDate = new Date(file.uploadedAt);
                if (dateFilter === 'today') {
                    return fileDate.toDateString() === now.toDateString();
                }
                if (dateFilter === 'week') {
                    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    return fileDate >= weekAgo;
                }
                if (dateFilter === 'month') {
                    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                    return fileDate >= monthAgo;
                }
                return true;
            });
        }

        // Apply sorting
        result = [...result].sort((a, b) => {
            if (sortBy === 'newest') return new Date(b.uploadedAt) - new Date(a.uploadedAt);
            if (sortBy === 'oldest') return new Date(a.uploadedAt) - new Date(b.uploadedAt);
            if (sortBy === 'largest') return b.fileSize - a.fileSize;
            if (sortBy === 'smallest') return a.fileSize - b.fileSize;
            if (sortBy === 'name') return a.originalFileName.localeCompare(b.originalFileName);
            return 0;
        });

        return result;
    };

    const filteredFiles = getFilteredAndSortedFiles();

    return (
        <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#f0f2f5' }}>
            {/* Sidebar */}
            <Drawer
                variant="permanent"
                sx={{
                    width: DRAWER_WIDTH,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: DRAWER_WIDTH,
                        boxSizing: 'border-box',
                        background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        borderRight: 'none',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                    },
                }}
            >
                {/* Logo */}
                <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <img src={logo} alt="Logo" style={{ width: 40, height: 40 }} />
                    <Typography variant="h5" sx={{ fontWeight: 700, color: 'white' }}>
                        Mini Google Drive
                    </Typography>
                </Box>

                {/* Navigation */}
                <List sx={{ px: 2 }}>
                    <ListItem
                        button
                        onClick={() => setCurrentView('dashboard')}
                        sx={{
                            borderRadius: 2,
                            mb: 1,
                            bgcolor: currentView === 'dashboard' ? 'rgba(255, 255, 255, 0.25)' : 'transparent',
                            '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.35)' },
                            cursor: 'pointer'
                        }}
                    >
                        <ListItemIcon>
                            <DashboardIcon sx={{ color: 'white' }} />
                        </ListItemIcon>
                        <ListItemText
                            primary="Dashboard"
                            primaryTypographyProps={{ 
                                fontWeight: currentView === 'dashboard' ? 600 : 400, 
                                color: 'white' 
                            }}
                        />
                    </ListItem>

                    <ListItem
                        button
                        onClick={() => setCurrentView('myDocuments')}
                        sx={{
                            borderRadius: 2,
                            mb: 1,
                            bgcolor: currentView === 'myDocuments' ? 'rgba(255, 255, 255, 0.25)' : 'transparent',
                            '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.15)' },
                            cursor: 'pointer'
                        }}
                    >
                        <ListItemIcon>
                            <Folder sx={{ color: 'white' }} />
                        </ListItemIcon>
                        <ListItemText
                            primary="My Documents"
                            primaryTypographyProps={{ 
                                color: 'white',
                                fontWeight: currentView === 'myDocuments' ? 600 : 400
                            }}
                        />
                    </ListItem>

                    <ListItem
                        button
                        onClick={() => setCurrentView('shared')}
                        sx={{
                            borderRadius: 2,
                            bgcolor: currentView === 'shared' ? 'rgba(255, 255, 255, 0.25)' : 'transparent',
                            '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.15)' },
                            cursor: 'pointer'
                        }}
                    >
                        <ListItemIcon>
                            <PeopleAlt sx={{ color: 'white' }} />
                        </ListItemIcon>
                        <ListItemText
                            primary="Shared with me"
                            primaryTypographyProps={{ 
                                color: 'white',
                                fontWeight: currentView === 'shared' ? 600 : 400
                            }}
                        />
                    </ListItem>
                </List>

                {/* Storage Info */}
                <Box sx={{ p: 3, mt: 4 }}>
                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 1, display: 'block', fontWeight: 600 }}>
                        Storage
                    </Typography>
                    <Box sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', height: 8, borderRadius: 4, mb: 1 }}>
                        <Box
                            sx={{
                                bgcolor: '#ffd54f',
                                height: 8,
                                borderRadius: 4,
                                width: `${Math.min((files.reduce((acc, f) => acc + f.fileSize, 0) / 15000000) * 100, 100)}%`
                            }}
                        />
                    </Box>
                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 500 }}>
                        {getTotalSize()} of 15 GB used
                    </Typography>
                </Box>
            </Drawer>

            {/* Main Content */}
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Top Bar */}
                <AppBar
                    position="static"
                    elevation={0}
                    sx={{
                        background: 'white',
                        borderBottom: '1px solid #e8edf2',
                    }}
                >
                    <Toolbar sx={{ py: 1.5, px: 3 }}>
                        {/* Search Bar */}
                        <TextField
                            placeholder="Let's find that doc..."
                            variant="outlined"
                            size="small"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            sx={{
                                width: 400,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 8,
                                    bgcolor: '#f7f9fc',
                                    '& fieldset': { borderColor: '#e8edf2' },
                                    '&:hover fieldset': { borderColor: '#667eea' },
                                }
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search sx={{ color: '#667eea' }} />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        {/* Spacer */}
                        <Box sx={{ flexGrow: 1 }} />

                        {/* User Profile */}
                        <IconButton 
                            onClick={(e) => {
                                setAnchorEl(e.currentTarget);
                                setSelectedFile(null);
                            }}
                        >
                            <Avatar 
                                sx={{ 
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    width: 44, 
                                    height: 44,
                                    fontWeight: 700,
                                    fontSize: '1.2rem'
                                }}
                            >
                                {(user?.firstName?.[0] || 'U').toUpperCase()}
                            </Avatar>
                        </IconButton>
                    </Toolbar>
                </AppBar>

                {/* Floating Alerts - Just Below Top Bar */}
                {error && (
                    <Alert 
                        severity="error" 
                        sx={{ 
                            position: 'fixed',
                            top: 90,
                            right: 32,
                            zIndex: 1300,
                            minWidth: 350,
                            borderRadius: 3, 
                            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                        }} 
                        onClose={() => setError('')}
                    >
                        {error}
                    </Alert>
                )}
                {success && (
                    <Alert 
                        severity="success" 
                        sx={{ 
                            position: 'fixed',
                            top: 90,
                            right: 32,
                            zIndex: 1300,
                            minWidth: 350,
                            borderRadius: 3, 
                            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                        }} 
                        onClose={() => setSuccess('')}
                    >
                        {success}
                    </Alert>
                )}

                {/* Content Area */}
                <Box sx={{ flexGrow: 1, overflow: 'auto', p: 4, bgcolor: '#f7f9fc' }}>

                    {/* Welcome Section */}
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h4" sx={{ fontWeight: 800, color: '#1d2129', mb: 0.5 }}>
                            Welcome back, {user?.firstName}! 👋
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#6e7c87', fontWeight: 400 }}>
                            {currentView === 'dashboard' && "Here's what's happening with your documents today"}
                            {currentView === 'myDocuments' && "All your uploaded documents"}
                            {currentView === 'shared' && "Files others have shared with you"}
                        </Typography>
                    </Box>

                    {/* Stats Cards - Compact Version */}
                    <Box sx={{ display: 'flex', gap: 3, mb: 4 }}>
                        <Paper
                            elevation={0}
                            sx={{
                                flex: 1,
                                p: 2.5,
                                borderRadius: 3,
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
                                boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)',
                                transition: 'transform 0.2s ease',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
                                }
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box
                                    sx={{
                                        bgcolor: 'rgba(255, 255, 255, 0.2)',
                                        p: 1.5,
                                        borderRadius: 2,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <InsertDriveFile sx={{ fontSize: 28 }} />
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                                    <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500, fontSize: '1.5rem'}}>
                                        Total Documents:
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 800,  fontSize: '1.5rem' }}>
                                        {files.filter(f => f.ownerEmail === user?.email).length}
                                    </Typography>
                                </Box>
                            </Box>
                        </Paper>

                        <Paper
                            elevation={0}
                            sx={{
                                flex: 1,
                                p: 2.5,
                                borderRadius: 3,
                                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                                color: 'white',
                                boxShadow: '0 4px 16px rgba(240, 147, 251, 0.3)',
                                transition: 'transform 0.2s ease',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: '0 8px 24px rgba(240, 147, 251, 0.4)',
                                }
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box
                                    sx={{
                                        bgcolor: 'rgba(255, 255, 255, 0.2)',
                                        p: 1.5,
                                        borderRadius: 2,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <CloudUpload sx={{ fontSize: 28 }} />
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                                    <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500,  fontSize: '1.5rem' }}>
                                        Files Today:
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 800,  fontSize: '1.5rem' }}>
                                        {files.filter(f => {
                                            const today = new Date().toDateString();
                                            return new Date(f.uploadedAt).toDateString() === today &&
                                                f.ownerEmail === user?.email;
                                        }).length}
                                    </Typography>
                                </Box>
                            </Box>
                        </Paper>

                        <Paper
                            elevation={0}
                            sx={{
                                flex: 1,
                                p: 2.5,
                                borderRadius: 3,
                                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                                color: 'white',
                                boxShadow: '0 4px 16px rgba(79, 172, 254, 0.3)',
                                transition: 'transform 0.2s ease',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: '0 8px 24px rgba(79, 172, 254, 0.4)',
                                }
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box
                                    sx={{
                                        bgcolor: 'rgba(255, 255, 255, 0.2)',
                                        p: 1.5,
                                        borderRadius: 2,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <Folder sx={{ fontSize: 28 }} />
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                                    <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500,  fontSize: '1.5rem' }}>
                                        Storage Used:
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 800,  fontSize: '1.5rem' }}>
                                        {getTotalSize()}
                                    </Typography>
                                </Box>
                            </Box>
                        </Paper>
                    </Box>

                    {/* NEW: Filter Section */}
                    <Paper
                        elevation={0}
                        sx={{
                            p: 2.5,
                            borderRadius: 3,
                            mb: 3,
                            border: '1px solid #e8edf2',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
                            {/* File Type Filter */}
                            <Box>
                                <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1, fontWeight: 600, color: '#6e7c87' }}>
                                    <FilterList sx={{ fontSize: 16 }} /> File Type
                                </Typography>
                                <ButtonGroup variant="outlined" size="small">
                                    <Button 
                                        onClick={() => setFileTypeFilter('all')}
                                        variant={fileTypeFilter === 'all' ? 'contained' : 'outlined'}
                                        sx={{ 
                                            background: fileTypeFilter === 'all' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                                            color: fileTypeFilter === 'all' ? 'white' : '#667eea',
                                            borderColor: '#667eea',
                                            '&:hover': { borderColor: '#667eea' }
                                        }}
                                    >
                                        All
                                    </Button>
                                    <Button 
                                        onClick={() => setFileTypeFilter('pdf')}
                                        variant={fileTypeFilter === 'pdf' ? 'contained' : 'outlined'}
                                        sx={{ 
                                            background: fileTypeFilter === 'pdf' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                                            color: fileTypeFilter === 'pdf' ? 'white' : '#667eea',
                                            borderColor: '#667eea',
                                            '&:hover': { borderColor: '#667eea' }
                                        }}
                                    >
                                        PDF
                                    </Button>
                                    <Button 
                                        onClick={() => setFileTypeFilter('image')}
                                        variant={fileTypeFilter === 'image' ? 'contained' : 'outlined'}
                                        sx={{ 
                                            background: fileTypeFilter === 'image' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                                            color: fileTypeFilter === 'image' ? 'white' : '#667eea',
                                            borderColor: '#667eea',
                                            '&:hover': { borderColor: '#667eea' }
                                        }}
                                    >
                                        Images
                                    </Button>
                                    <Button 
                                        onClick={() => setFileTypeFilter('document')}
                                        variant={fileTypeFilter === 'document' ? 'contained' : 'outlined'}
                                        sx={{ 
                                            background: fileTypeFilter === 'document' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                                            color: fileTypeFilter === 'document' ? 'white' : '#667eea',
                                            borderColor: '#667eea',
                                            '&:hover': { borderColor: '#667eea' }
                                        }}
                                    >
                                        Docs
                                    </Button>
                                </ButtonGroup>
                            </Box>

                            {/* Date Filter */}
                            <Box>
                                <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1, fontWeight: 600, color: '#6e7c87' }}>
                                    <CalendarToday sx={{ fontSize: 16 }} /> Date
                                </Typography>
                                <ButtonGroup variant="outlined" size="small">
                                    <Button 
                                        onClick={() => setDateFilter('all')}
                                        variant={dateFilter === 'all' ? 'contained' : 'outlined'}
                                        sx={{ 
                                            background: dateFilter === 'all' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                                            color: dateFilter === 'all' ? 'white' : '#667eea',
                                            borderColor: '#667eea',
                                            '&:hover': { borderColor: '#667eea' }
                                        }}
                                    >
                                        All Time
                                    </Button>
                                    <Button 
                                        onClick={() => setDateFilter('today')}
                                        variant={dateFilter === 'today' ? 'contained' : 'outlined'}
                                        sx={{ 
                                            background: dateFilter === 'today' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                                            color: dateFilter === 'today' ? 'white' : '#667eea',
                                            borderColor: '#667eea',
                                            '&:hover': { borderColor: '#667eea' }
                                        }}
                                    >
                                        Today
                                    </Button>
                                    <Button 
                                        onClick={() => setDateFilter('week')}
                                        variant={dateFilter === 'week' ? 'contained' : 'outlined'}
                                        sx={{ 
                                            background: dateFilter === 'week' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                                            color: dateFilter === 'week' ? 'white' : '#667eea',
                                            borderColor: '#667eea',
                                            '&:hover': { borderColor: '#667eea' }
                                        }}
                                    >
                                        This Week
                                    </Button>
                                    <Button 
                                        onClick={() => setDateFilter('month')}
                                        variant={dateFilter === 'month' ? 'contained' : 'outlined'}
                                        sx={{ 
                                            background: dateFilter === 'month' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                                            color: dateFilter === 'month' ? 'white' : '#667eea',
                                            borderColor: '#667eea',
                                            '&:hover': { borderColor: '#667eea' }
                                        }}
                                    >
                                        This Month
                                    </Button>
                                </ButtonGroup>
                            </Box>

                            {/* Sort Filter */}
                            <Box>
                                <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1, fontWeight: 600, color: '#6e7c87' }}>
                                    <Sort sx={{ fontSize: 16 }} /> Sort By
                                </Typography>
                                <ButtonGroup variant="outlined" size="small">
                                    <Button 
                                        onClick={() => setSortBy('newest')}
                                        variant={sortBy === 'newest' ? 'contained' : 'outlined'}
                                        sx={{ 
                                            background: sortBy === 'newest' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                                            color: sortBy === 'newest' ? 'white' : '#667eea',
                                            borderColor: '#667eea',
                                            '&:hover': { borderColor: '#667eea' }
                                        }}
                                    >
                                        Newest
                                    </Button>
                                    <Button 
                                        onClick={() => setSortBy('oldest')}
                                        variant={sortBy === 'oldest' ? 'contained' : 'outlined'}
                                        sx={{ 
                                            background: sortBy === 'oldest' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                                            color: sortBy === 'oldest' ? 'white' : '#667eea',
                                            borderColor: '#667eea',
                                            '&:hover': { borderColor: '#667eea' }
                                        }}
                                    >
                                        Oldest
                                    </Button>
                                    <Button 
                                        onClick={() => setSortBy('largest')}
                                        variant={sortBy === 'largest' ? 'contained' : 'outlined'}
                                        sx={{ 
                                            background: sortBy === 'largest' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                                            color: sortBy === 'largest' ? 'white' : '#667eea',
                                            borderColor: '#667eea',
                                            '&:hover': { borderColor: '#667eea' }
                                        }}
                                    >
                                        Largest
                                    </Button>
                                    <Button 
                                        onClick={() => setSortBy('name')}
                                        variant={sortBy === 'name' ? 'contained' : 'outlined'}
                                        sx={{ 
                                            background: sortBy === 'name' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                                            color: sortBy === 'name' ? 'white' : '#667eea',
                                            borderColor: '#667eea',
                                            '&:hover': { borderColor: '#667eea' }
                                        }}
                                    >
                                        A-Z
                                    </Button>
                                </ButtonGroup>
                            </Box>
                        </Box>
                    </Paper>

                    {/* Files Section Header */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1d2129' }}>
                            {getViewTitle()}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Chip 
                                label={`${filteredFiles.length} files`} 
                                sx={{ 
                                    bgcolor: '#667eea', 
                                    color: 'white', 
                                    fontWeight: 600 
                                }} 
                            />
                            <ButtonGroup variant="outlined" size="small">
                                <IconButton
                                    onClick={() => setViewMode('grid')}
                                    sx={{
                                        bgcolor: viewMode === 'grid' ? '#667eea' : 'transparent',
                                        color: viewMode === 'grid' ? 'white' : '#667eea',
                                        borderColor: '#667eea',
                                        borderRadius: '4px 0 0 4px',
                                        '&:hover': { bgcolor: viewMode === 'grid' ? '#5568d3' : '#f7f9fc' }
                                    }}
                                >
                                    <ViewModule />
                                </IconButton>
                                <IconButton
                                    onClick={() => setViewMode('list')}
                                    sx={{
                                        bgcolor: viewMode === 'list' ? '#667eea' : 'transparent',
                                        color: viewMode === 'list' ? 'white' : '#667eea',
                                        borderColor: '#667eea',
                                        borderRadius: '0 4px 4px 0',
                                        borderLeft: '1px solid #667eea',
                                        '&:hover': { bgcolor: viewMode === 'list' ? '#5568d3' : '#f7f9fc' }
                                    }}
                                >
                                    <ViewList />
                                </IconButton>
                            </ButtonGroup>
                        </Box>
                    </Box>

                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                            <CircularProgress sx={{ color: '#667eea' }} size={60} />
                        </Box>
                    ) : filteredFiles.length === 0 ? (
                        <Paper
                            elevation={0}
                            sx={{
                                p: 8,
                                textAlign: 'center',
                                borderRadius: 4,
                                bgcolor: 'white',
                                border: '2px dashed #e8edf2',
                                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
                            }}
                        >
                            <Folder sx={{ fontSize: 100, color: '#667eea', opacity: 0.3, mb: 2 }} />
                            <Typography variant="h5" sx={{ color: '#1d2129', fontWeight: 600, mb: 1 }}>
                                {searchQuery ? 'No files found' : 
                                 currentView === 'dashboard' ? 'No files match your filters' :
                                 currentView === 'myDocuments' ? 'No files yet' :
                                 'No files shared with you yet'}
                            </Typography>
                            <Typography variant="body1" color="textSecondary">
                                {searchQuery || fileTypeFilter !== 'all' || dateFilter !== 'all' ? 'Try adjusting your filters' : 
                                 currentView === 'shared' ? 'Files shared with you will appear here' :
                                 'Click the + button to upload your first file'}
                            </Typography>
                        </Paper>
                    ) : viewMode === 'grid' ? (
                        /* Grid View */
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                                gap: 3,
                                mb: 12,
                            }}
                        >
                            {filteredFiles.map((file) => (
                                <Paper
                                    key={file.id}
                                    elevation={0}
                                    sx={{
                                        borderRadius: 3,
                                        overflow: 'hidden',
                                        border: '1px solid #e8edf2',
                                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            boxShadow: '0 8px 24px rgba(102, 126, 234, 0.15)',
                                            transform: 'translateY(-4px)',
                                        },
                                        cursor: 'pointer',
                                    }}
                                >
                                    {/* File Preview */}
                                    <Box
                                        onClick={() => handleOpenFile(file)}
                                        sx={{
                                            height: 200,
                                            bgcolor: file.fileType?.includes('pdf') ? '#ffebee' :
                                                file.fileType?.includes('image') ? '#e8f5e9' :
                                                    file.fileType?.includes('text') ? '#e3f2fd' : '#f5f5f5',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            position: 'relative',
                                        }}
                                    >
                                        {getFileIcon(file.fileType)}
                                        {file.ownerEmail !== user?.email && (
                                            <Chip 
                                                label="Shared" 
                                                size="small" 
                                                sx={{ 
                                                    position: 'absolute',
                                                    top: 12,
                                                    right: 12,
                                                    bgcolor: '#e3f2fd', 
                                                    color: '#1976d2',
                                                    fontWeight: 600,
                                                    fontSize: '0.7rem'
                                                }} 
                                            />
                                        )}
                                    </Box>

                                    {/* File Info */}
                                    <Box sx={{ p: 2 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography 
                                                variant="subtitle1" 
                                                sx={{ 
                                                    fontWeight: 600, 
                                                    color: '#1d2129',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                    flex: 1,
                                                    mr: 1
                                                }}
                                            >
                                                {file.originalFileName}
                                            </Typography>
                                            <IconButton
                                                size="small"
                                                sx={{
                                                    bgcolor: '#f7f9fc',
                                                    '&:hover': { bgcolor: '#e8edf2' }
                                                }}
                                                onClick={(e) => handleMenuOpen(e, file)}
                                            >
                                                <MoreVert fontSize="small" />
                                            </IconButton>
                                        </Box>
                                        <Typography variant="caption" sx={{ color: '#6e7c87', display: 'block' }}>
                                            {formatFileSize(file.fileSize)}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: '#6e7c87' }}>
                                            {new Date(file.uploadedAt).toLocaleDateString()}
                                        </Typography>
                                        {file.ownerEmail !== user?.email && (
                                            <Typography variant="caption" sx={{ color: '#6e7c87', display: 'block', mt: 0.5 }}>
                                                Owner: {file.ownerEmail}
                                            </Typography>
                                        )}
                                    </Box>
                                </Paper>
                            ))}
                        </Box>
                    ) : (
                        /* List View */
                        <Paper
                            elevation={0}
                            sx={{
                                borderRadius: 4,
                                overflow: 'hidden',
                                border: '1px solid #e8edf2',
                                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
                                mb: 12,
                            }}
                        >
                            {filteredFiles.map((file, index) => (
                                <Box
                                    key={file.id}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        p: 3,
                                        borderBottom: index < filteredFiles.length - 1 ? '1px solid #e8edf2' : 'none',
                                        transition: 'all 0.2s ease',
                                        '&:hover': { 
                                            bgcolor: '#f7f9fc',
                                            transform: 'translateX(8px)',
                                        },
                                        cursor: 'pointer'
                                    }}
                                >
                                    {/* File Icon */}
                                    <Box
                                        sx={{
                                            width: 64,
                                            height: 64,
                                            borderRadius: 3,
                                            bgcolor: file.fileType?.includes('pdf') ? '#ffebee' :
                                                file.fileType?.includes('image') ? '#e8f5e9' :
                                                    file.fileType?.includes('text') ? '#e3f2fd' : '#f5f5f5',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mr: 3,
                                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                        }}
                                    >
                                        {getFileIcon(file.fileType)}
                                    </Box>

                                    {/* File Info */}
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#1d2129', mb: 0.5 }}>
                                            {file.originalFileName}
                                            {file.ownerEmail !== user?.email && (
                                                <Chip 
                                                    label="Shared" 
                                                    size="small" 
                                                    sx={{ 
                                                        ml: 1, 
                                                        bgcolor: '#e3f2fd', 
                                                        color: '#1976d2',
                                                        fontWeight: 600,
                                                        fontSize: '0.7rem'
                                                    }} 
                                                />
                                            )}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#6e7c87' }}>
                                            {formatFileSize(file.fileSize)} • {new Date(file.uploadedAt).toLocaleDateString()}
                                            {file.ownerEmail !== user?.email && ` • Owner: ${file.ownerEmail}`}
                                        </Typography>
                                    </Box>

                                    {/* Actions */}
                                    <Button
                                        variant="contained"
                                        sx={{
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            color: 'white',
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            px: 3,
                                            borderRadius: 2,
                                            mr: 2,
                                            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                                            '&:hover': {
                                                background: 'linear-gradient(135deg, #5568d3 0%, #65398b 100%)',
                                                boxShadow: '0 6px 16px rgba(102, 126, 234, 0.4)',
                                            }
                                        }}
                                        onClick={() => handleOpenFile(file)}
                                    >
                                        Open
                                    </Button>
                                    <IconButton
                                        sx={{
                                            bgcolor: '#f7f9fc',
                                            '&:hover': { bgcolor: '#e8edf2' }
                                        }}
                                        onClick={(e) => handleMenuOpen(e, file)}
                                    >
                                        <MoreVert />
                                    </IconButton>
                                </Box>
                            ))}
                        </Paper>
                    )}
                </Box>
            </Box>

            {/* Floating Upload Button */}
            <Fab
                color="primary"
                component="label"
                sx={{
                    position: 'fixed',
                    bottom: 40,
                    right: 40,
                    width: 72,
                    height: 72,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
                    '&:hover': {
                        background: 'linear-gradient(135deg, #5568d3 0%, #65398b 100%)',
                        boxShadow: '0 12px 32px rgba(102, 126, 234, 0.5)',
                        transform: 'scale(1.1)',
                    },
                    transition: 'all 0.3s ease',
                }}
                disabled={uploading}
            >
                <input type="file" hidden onChange={handleFileInputChange} />
                {uploading ? <CircularProgress size={28} sx={{ color: 'white' }} /> : <Add sx={{ fontSize: 32 }} />}
            </Fab>

            {/* File Context Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl) && Boolean(selectedFile)}
                onClose={handleMenuClose}
                PaperProps={{
                    sx: { 
                        borderRadius: 3, 
                        minWidth: 200,
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                    }
                }}
            >
                <MenuItem 
                    onClick={() => {
                        setShareDialogOpen(true);
                    }}
                    sx={{ py: 1.5 }}
                >
                    <Share sx={{ mr: 2, fontSize: 22, color: '#667eea' }} /> 
                    <Typography sx={{ fontWeight: 500 }}>Share</Typography>
                </MenuItem>
                <MenuItem 
                    onClick={() => {
                        if (selectedFile) handleDownload(selectedFile);
                        handleMenuClose();
                    }}
                    sx={{ py: 1.5 }}
                >
                    <Download sx={{ mr: 2, fontSize: 22, color: '#667eea' }} /> 
                    <Typography sx={{ fontWeight: 500 }}>Download</Typography>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleDelete} sx={{ py: 1.5, color: 'error.main' }}>
                    <Delete sx={{ mr: 2, fontSize: 22 }} /> 
                    <Typography sx={{ fontWeight: 500 }}>Delete</Typography>
                </MenuItem>
            </Menu>

            {/* Profile Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl) && !selectedFile}
                onClose={handleMenuClose}
                PaperProps={{
                    sx: { 
                        borderRadius: 3, 
                        minWidth: 280,
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                    }
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <Box sx={{ px: 3, py: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Avatar 
                            sx={{ 
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                width: 56, 
                                height: 56,
                                fontSize: '1.5rem',
                                fontWeight: 700
                            }}
                        >
                            {(user?.firstName?.[0] || 'U').toUpperCase()}
                        </Avatar>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                {user?.firstName} {user?.lastName}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                {user?.email}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
                <Divider />
                <MenuItem onClick={handleLogout} sx={{ py: 2, px: 3 }}>
                    <Logout sx={{ mr: 2, fontSize: 22, color: '#667eea' }} /> 
                    <Typography sx={{ fontWeight: 600 }}>Logout</Typography>
                </MenuItem>
            </Menu>

            {/* Share Dialog */}
            <Dialog 
                open={shareDialogOpen} 
                onClose={() => {
                    setShareDialogOpen(false);
                    setShareEmail('');
                    handleMenuClose();
                }}
                PaperProps={{
                    sx: { borderRadius: 3, minWidth: 450 }
                }}
            >
                <DialogTitle sx={{ fontWeight: 700, fontSize: '1.5rem', pb: 1 }}>
                    Share File
                </DialogTitle>
                <DialogContent sx={{ pt: 2 }}>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                        File: <strong>{selectedFile?.originalFileName}</strong>
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                        Enter the email address of the person you want to share with
                    </Typography>
                    <TextField
                        fullWidth
                        label="Email Address"
                        type="email"
                        value={shareEmail}
                        onChange={(e) => setShareEmail(e.target.value)}
                        placeholder="user@example.com"
                        autoFocus
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                            }
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Email sx={{ color: '#667eea' }} />
                                </InputAdornment>
                            ),
                        }}
                    />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button 
                        onClick={() => {
                            setShareDialogOpen(false);
                            setShareEmail('');
                        }}
                        sx={{ 
                            textTransform: 'none', 
                            fontWeight: 600,
                            color: '#6e7c87'
                        }}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleShareFile}
                        variant="contained"
                        disabled={!shareEmail}
                        sx={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            textTransform: 'none',
                            fontWeight: 600,
                            px: 3,
                            borderRadius: 2,
                            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #5568d3 0%, #65398b 100%)',
                                boxShadow: '0 6px 16px rgba(102, 126, 234, 0.4)',
                            }
                        }}
                    >
                        Share
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Dashboard;