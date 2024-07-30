const express = require("express");
const path = require('path');
const fs = require('fs');
const jwt = require("jsonwebtoken");
const jwtDecode = require('jwt-decode');

const app = express();
const PORT = 8000;

var accouts = "./accouts.json"
var images = "./images.json"
var encrypter = "ibutytuiu89r56tcyjhknklihg8fty"

app.listen(PORT, () => console.log("Server started."));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'build')));
app.use(express.json());

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

app.post("/api/register", async (req, res) => {
    const { username, password } = req.body;
     // Read and update accounts file
     fs.readFile(accouts, 'utf8')
     .then(data => {
         let jsonData = JSON.parse(data);

         if (jsonData[username] !== undefined) {
             return res.status(403).json({ message: 'User already exists' });
         }

         jsonData[username] = password;
         return fs.writeFile(accouts, JSON.stringify(jsonData, null, 2), 'utf8');
     })
     .then(() => {
         // Read and update images file
         return fs.readFile(images, 'utf8');
     })
     .then(data => {
         let jsonData = JSON.parse(data);

         if (jsonData[username] !== undefined) {
             return res.status(403).json({ message: 'User already exists' });
         }

         jsonData[username] = [];
         return fs.writeFile(images, JSON.stringify(jsonData, null, 2), 'utf8');
     })
     .then(() => {
         // Generate JWT token
         const token = jwt.sign({ username }, encrypter, { expiresIn: '1h' });
         res.json({ token });
     })
     .catch(err => {
         console.error('Error:', err);
         res.status(500).json({ message: 'Internal Server Error' });
     });
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