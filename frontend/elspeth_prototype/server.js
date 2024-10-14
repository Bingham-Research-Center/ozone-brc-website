const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Serve static files from the current directory
app.use(express.static(__dirname));

// Endpoint to list text files
app.get('/files', (req, res) => {
    fs.readdir(__dirname, (err, files) => {
        if (err) return res.status(500).send('Unable to scan directory: ' + err);

        // Filter for .txt files
        const txtFiles = files.filter(file => path.extname(file) === '.txt');
        res.json(txtFiles);
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
