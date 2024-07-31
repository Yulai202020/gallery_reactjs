const express = require("express");
const path = require('path');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const jwt = require("jsonwebtoken");

const app = express();
const PORT = 8000;

var photos_folder = "./photos/"
var accouts = "./accouts.json"
var images = "./images.json"
var encrypter = "ibutytuiu89r56tcyjhknklihg8fty"

app.listen(PORT, () => console.log("Server started."));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'build')));
app.use(express.json());

app.use(cors());

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
  
    try {
        const decoded = jwt.verify(token, encrypter);
        req.username = decoded.username;
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Token is expired' });
    }
};

// not work
app.post('/api/upload', verifyToken, (req, res) => {
    if (!req.username) {
        return res.status(403).json({ message: 'User not authenticated' });
    }

    console.log(req.body)

    if (!req.body || !Buffer.isBuffer(req.body)) {
        return res.status(400).json({ message: 'No file sent or invalid file data' });
    }

    const fileBuffer = req.body;
    const fileName = `${Date.now()}-uploaded-file`; // You might want to derive a filename or use one from headers

    const userFolder = path.join(photos_folder, req.username);
    if (!fs.existsSync(userFolder)) {
        fs.mkdirSync(userFolder, { recursive: true });
    }

    const filePath = path.join(userFolder, fileName);

    fs.writeFile(filePath, fileBuffer, (err) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to save file' });
        }

        res.status(200).json({ message: "OK" });
    });
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

    fs.readFile(images, 'utf8', (err, data) => {
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

        res.json(jsonData[username]);
    });
});

// works
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    fs.readFile(accouts, 'utf8', (err, data) => {
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

        let real_password;

        try {
            real_password = jsonData[username];
        } catch (parseErr) {
            res.status(404).json({ message: 'Username not found' });
        }

        if (real_password === password) {
            const token = jwt.sign({ username }, encrypter, { expiresIn: '1h' });
            res.json({ token });
        } else {
            res.status(403).json({ message: 'Invalid password' });
        }
    });
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

    fs.readFile(images, 'utf8', (err, data) => {
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

    try {
        // Read accounts file
        const accountsData = await fs.promises.readFile(accouts, 'utf8');
        let accounts = JSON.parse(accountsData);

        if (accounts[username] !== undefined) {
            return res.status(403).json({ message: 'User already exists' });
        }

        accounts[username] = password;
        await fs.promises.writeFile(accouts, JSON.stringify(accounts, null, 2), 'utf8');

        // Read images file
        const imagesData = await fs.promises.readFile(images, 'utf8');
        let images_json = JSON.parse(imagesData);

        if (images_json[username] !== undefined) {
            return res.status(403).json({ message: 'User already exists' });
        }

        images_json[username] = [];
        await fs.promises.writeFile(images_json, JSON.stringify(images_json, null, 2), 'utf8');

        // Generate token
        const token = jwt.sign({ username }, encrypter, { expiresIn: '1h' });
        res.status(200).json({ token });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// works
app.post("/api/add", (req, res) => {
    var {token, link, alt, width, height} = req.body;
    var username;

    try {
        username = jwt.decode(token).username;
    } catch {
        res.status(403).json({ message: 'Token is expired' });
        return;
    }

    fs.readFile(images, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading the file:', err);
            return;
        }
    
        // Step 2: Parse the JSON content
        let jsonData;
        try {
            jsonData = JSON.parse(data);
        } catch (parseErr) {
            console.error('Error parsing JSON or JSON is not an array:', parseErr);
            return;
        }
    
        // Step 3: Edit the JSON content
        // Example: Adding a new element to the array
        jsonData[username].push({"link": link, "alt": alt, "width": Number(width), "height": Number(height)});
    
        // Step 4: Write the updated JSON back to the file
        fs.writeFile(images, JSON.stringify(jsonData, null, 2), 'utf8', (writeErr) => {
            if (writeErr) {
                console.error('Error writing the file:', writeErr);
                return;
            }
        });
    });

    res.status(200).json({ message: 'OK' });
});

// works
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});  