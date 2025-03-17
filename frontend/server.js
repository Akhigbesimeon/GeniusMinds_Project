const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000; // Changed back to 3000

// System Configuration
const SYSTEM_CONFIG = {
    CURRENT_TIME: '2025-03-17 11:11:25',
    CURRENT_USER: 'Miranics'
};

// Add CORS headers
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// Simplified logging middleware
app.use((req, res, next) => {
    console.log(`${SYSTEM_CONFIG.CURRENT_TIME} - ${req.method} ${req.url}`);
    next();
});

// Serve static files
app.use(express.static(path.join(__dirname)));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Parse JSON bodies
app.use(express.json());

// Mock user database
const testUsers = [
    {
        username: 'testuser',
        password: 'password123',
        email: 'test@example.com',
        fullname: 'Test User',
        userType: 'student'
    }
];

// Root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Login endpoint
app.post('/api/auth/login', (req, res) => {
    console.log('Login attempt:', req.body);
    const { username, password } = req.body;
    
    const user = testUsers.find(u => u.username === username && u.password === password);
    
    if (user) {
        console.log(`Login successful for user: ${username}`);
        res.json({
            success: true,
            access_token: `token_${Date.now()}_${username}`,
            username: username,
            userType: user.userType
        });
    } else {
        console.log(`Failed login attempt for user: ${username}`);
        res.status(401).json({
            success: false,
            message: 'Invalid credentials'
        });
    }
});

// Registration endpoint
app.post('/api/auth/register', (req, res) => {
    console.log('Registration attempt:', req.body);
    const { username, password, email, fullname, userType } = req.body;
    
    if (!username || !password || !email || !fullname || !userType) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required'
        });
    }
    
    if (testUsers.find(u => u.username === username)) {
        return res.status(400).json({
            success: false,
            message: 'Username already exists'
        });
    }
    
    testUsers.push({
        username,
        password,
        email,
        fullname,
        userType
    });
    
    console.log(`New user registered: ${username}`);
    res.json({
        success: true,
        message: 'Registration successful'
    });
});

// Dashboard route
app.get('/dashboard.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});

// Error handling
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    if (!res.headersSent) {
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
});

// Start server
app.listen(port, () => {
    console.clear(); // Clear the console
    console.log('\n=== Server Status ===');
    console.log(`Time: ${SYSTEM_CONFIG.CURRENT_TIME}`);
    console.log(`User: ${SYSTEM_CONFIG.CURRENT_USER}`);
    console.log(`Port: ${port}`);
    console.log(`URL: http://localhost:${port}`);
    console.log('\n=== Test User ===');
    console.log('Username: testuser');
    console.log('Password: password123');
    console.log('\n=== Ready to accept connections ===\n');
});