const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Since everything is in the same directory as server.js,
// we don't need to include 'frontend' in the path
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use(express.json());

// Serve HTML files from the same directory as server.js
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/quiz', (req, res) => {
    res.sendFile(path.join(__dirname, 'quiz.html'));
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});