const express = require("express");
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const jwt = require("jsonwebtoken");

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const app = express();
const PORT = 8000;

var photos_folder = "photos"
var accountsFilePath = "./accounts.json"
var imagesFilePath = "./images.json"
var encrypter = "ibutytuiu89r56tcyjhknklihg8fty"

app.listen(PORT, () => console.log("Server started."));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'build')));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Set up the POST route for file uploads
app.post('/api/upload', upload.single('file'), (req, res) => {
    const { token } = req.body;
    var username;

    try {
        username = jwt.verify(token, encrypter).username;
    } catch {
        res.status(403).json({ message: 'Token is expired' });
        return;
    }

    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const uploadPath = path.join(__dirname, photos_folder, username);

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

// works
app.post("/api/images", (req, res) => {
    var {token} = req.body;
    var username;

    try {
        username = jwt.verify(token, encrypter).username;
    } catch {
        res.status(403).json({ message: 'Token is expired' });
        return;
    }

    const dirPath = path.join(__dirname, photos_folder, username);

    fs.readdir(dirPath, (err, files) => {
        if (err) {
            return res.status(500).send('Failed to list files.');
        }

        // for (const i in files) {
        //     var uploadPath = path.join(__dirname, photos_folder, username);
        //     uploadPath +=  "/"+files[i];
        //     files[i] = uploadPath;
        // }

        console.log(files)

        return res.status(200).json(files);
    });
});

app.post("/api/images", (req, res) => {
    var { token, filename } = req.body;
    var username;

    try {
        username = jwt.verify(token, encrypter).username;
    } catch {
        res.status(403).json({ message: 'Token is expired' });
        return;
    }

    const dirPath = path.join(__dirname, photos_folder, username);
    dirPath+'/'+filename;
});

// works
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const response = await prisma.user.findFirst({ where: { username:username }});

    if (response === null) {
        return res.status(404).json({ message: 'Username not found' });
    }
    if (response.password !== password) {
        return res.status(403).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ username }, encrypter, { expiresIn: '1h' });
    return res.status(200).json({ token });
});

// gotta be edit
app.post("/api/remove", async (req, res) => {
    const { token, id } = req.body;
    const numericId = Number(id);

    var username;

    try {
        username = jwt.verify(token, encrypter).username;
    } catch {
        res.status(403).json({ message: 'Token is expired' });
        return;
    }

    fs.readFile(imagesFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading the file:', err);
            return;
        }

        let jsonData;
        try {
            jsonData = JSON.parse(data);
        } catch (parseErr) {
            console.error('Error parsing JSON or JSON is not an array:', parseErr);
            return;
        }

        if (jsonData[username][numericId] === undefined) {
            return res.status(404).json({ message: 'Index wasnt found' });
        }

        jsonData[username].splice(numericId, 1);

        fs.writeFile(images, JSON.stringify(jsonData, null, 2), 'utf8', (writeErr) => {
            if (writeErr) {
                console.error('Error writing the file:', writeErr);
                return;
            }
        });
    });

    return res.status(200).json({ message: 'OK' });
});

// works

app.post("/api/register", async (req, res) => {
    const { username, password } = req.body;
    const response = await prisma.user.create({ where: { username: username }});
    if (response !== null) {
        const user = await prisma.user.create({ data: { username: username,  password: password }});

        const token = jwt.sign({ username }, encrypter, { expiresIn: '1h' });
        return res.status(200).json({ token });
    } else {
        return res.status(403).json({ message: 'User already exists' });
    }
});

// works
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});  
