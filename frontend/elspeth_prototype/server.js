const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Serve static files from the "TEXTFILES" directory
app.use(express.static(path.join(__dirname, 'TEXTFILES')));

// Endpoint to get the list of text files
app.get('/files', (req, res) => {
    const dirPath = path.join(__dirname, 'TEXTFILES');

    fs.readdir(dirPath, (err, files) => {
        if (err) {
            return res.status(500).send('Error reading directory');
        }
        const textFiles = files.filter(file => file.endsWith('.txt'));
        res.json(textFiles);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});