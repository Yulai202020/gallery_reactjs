const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 8000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Set up the POST route for file uploads
app.post('/api/upload', upload.single('file'), (req, res) => {
    const username = req.body.username;
    console.log(username);
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const uploadPath = path.join(__dirname, 'uploads', username);

    // Ensure the directory exists
    fs.mkdirSync(uploadPath, { recursive: true });

    const filePath = path.join(uploadPath, req.file.originalname);

    fs.writeFile(filePath, req.file.buffer, (err) => {
        if (err) {
            return res.status(500).send('Error saving the file.');
        }
    });

    res.status(200).json({ message: "OK" });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
