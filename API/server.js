// server.js
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();

app.use(cors({
    origin: 'http://localhost:5173', // Allow requests from this origin
    methods: ['GET', 'POST'], // Allow only GET and POST requests
    allowedHeaders: ['Content-Type'], // Allow the Content-Type header
}));
const uploadPath = path.join(__dirname, 'public', 'models');

// Multer configuration for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        fs.mkdirSync(uploadPath, { recursive: true }); // Ensure directory exists
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Keep original file name
    },
});

const upload = multer({ storage });

// Route for file upload
app.post('/api/upload', upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send({ message: 'No file uploaded' });
        }
        const filePath = path.join('public', 'models', req.file.originalname);
        console.log('File uploaded to:', filePath);
        res.status(200).json({ filePath });
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).send({ message: 'Server error' });
    }
});

// Serve uploaded files statically
app.use('/models', express.static(path.join(__dirname, 'public', 'models')));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
