const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

// Add CORS headers
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    const filePath = path.join(__dirname, decodeURIComponent(req.url));
    console.log(`Looking for: ${filePath}`);
    console.log(`File exists: ${fs.existsSync(filePath)}`);
    next();
});

// Serve static files with proper MIME types
app.use(express.static(__dirname, {
    setHeaders: (res, path) => {
        if (path.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        } else if (path.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
        } else if (path.endsWith('.png')) {
            res.setHeader('Content-Type', 'image/png');
        }
    }
}));

app.use('/assets', express.static(path.join(__dirname, 'assets'), {
    setHeaders: (res, path) => {
        if (path.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        } else if (path.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
        } else if (path.endsWith('.png')) {
            res.setHeader('Content-Type', 'image/png');
        }
    }
}));

app.use(express.json());

// Root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).send('Something broke!');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log('Checking file structure:');
    
    const files = [
        'assets/css/style.css',
        'assets/js/api.js',
        'assets/js/script.js',
        'assets/images/GeniusMinds_Logo_3.png'
    ];
    
    files.forEach(file => {
        const filepath = path.join(__dirname, file);
        console.log(`${file}: ${fs.existsSync(filepath) ? 'EXISTS' : 'MISSING'}`);
    });
});