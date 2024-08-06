const express = require("express");
const multer = require("multer");
var cors = require("cors")
const cookieParser = require("cookie-parser");

const bodyParser = require("body-parser");
const path = require("path");
const jwt = require("jsonwebtoken");
const fs = require("fs");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const app = express();
const PORT = 8000;

var photos_folder = "photos"
var encrypter = "ibutytuiu89r56tcyjhknklihg8fty"

app.listen(PORT, () => console.log("Server started."));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "build")));
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

var corsOptions = {
    origin: "http://0.0.0.0:3000",
}

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// work
app.post("/api/upload", upload.single("file"), async (req, res) => {
    const { token, subject, alt } = req.body;
    var username;

    try {
        username = jwt.verify(token, encrypter).username;
    } catch {
        res.status(403).json({ message: "Token is expired" });
        return;
    }

    if (!req.file) {
        return res.status(400).send("No file uploaded.");
    }

    const uploadPath = path.join(__dirname, photos_folder, username);

    // Ensure the directory exists
    fs.mkdirSync(uploadPath, { recursive: true });

    const filePath = path.join(uploadPath, req.file.originalname);

    fs.writeFile(filePath, req.file.buffer, (err) => {
        if (err) {
            return res.status(500).send("Error saving the file.");
        }
    });
        
    const response = await prisma.images.create({ data: { alt: alt, subject: subject, username: username, filename: req.file.originalname } });
    console.log("Uploaded image:")
    console.log(response)

    return res.status(200).json({ message: "OK" });
});

// works
app.get("/api/image/:id", async (req, res) => {
    // get username
    const token = req.cookies.token;
    const id = Number(req.params.id);
    var username;
    
    try {
        username = jwt.verify(token, encrypter).username;
    } catch {
        res.status(403).json({ message: "Token is expired" });
        return;
    }

    const response = await prisma.images.findFirst({ where: { id: id, username: username } })

    const filePath = path.join(__dirname, 'photos', username, response.filename);
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error('Error sending file:', err);
            res.status(500).send('Error sending file');
        }
    });

    return res.status(200).json({ message: "OK" });
});

app.post("/api/images", async (req, res) => {
    var { token } = req.body;
    var username;
    
    try {
        username = jwt.verify(token, encrypter).username;
    } catch {
        res.status(403).json({ message: "Token is expired" });
        return;
    }

    const response = await prisma.images.findMany({ where: { username: username } })
    console.log("Sended images:")
    console.log(response);

    return res.status(200).json(response);
});

// works
app.post("/api/login", async (req, res) => {
    const { username, password } = req.body;
    const response = await prisma.user.findFirst({ where: { username: username }});

    if (response === null) {
        return res.status(404).json({ message: "Username not found" });
    }
    if (response.password !== password) {
        return res.status(403).json({ message: "Invalid password" });
    }

    console.log("Logined in user:");
    console.log(response)

    const token = jwt.sign({ username }, encrypter, { expiresIn: "1h" });
    return res.status(200).json({ token });
});

// work
app.post("/api/remove", async (req, res) => {
    const { token, id } = req.body;
    var username;
    var numId = Number(id);

    try {
        username = jwt.verify(token, encrypter).username;
    } catch {
        res.status(403).json({ message: "Token is expired" });
        return;
    }

    const response = await prisma.images.findFirst({ where: { id: numId, username: username} });

    console.log("Removed image:");
    console.log(response)

    if (response !== null) {
        const deleteFile = path.join(photos_folder, username, response.filename);
    
        fs.unlink(deleteFile, (err) => {
            if (err) {
                console.error("Error deleting the file:", err);
                return res.status(500).send({ message: "Error deleting the file" });
            }
        });
    } else {
        return res.status(404).send({ message: "File not found." });
    }

    await prisma.images.delete({ where: { id: numId, username: username} });

    return res.status(200).json({ message: "OK" });
});

// works
app.post("/api/register", async (req, res) => {
    const { username, password } = req.body;
    const response = await prisma.user.findFirst({ where: { username: username }});

    if (response === null) {
        const user = await prisma.user.create({ data: { username: username,  password: password }});
        const token = jwt.sign({ username }, encrypter, { expiresIn: "1h" });
        
        console.log("Created user:");
        console.log(user)

        const folder_path = path.join(photos_folder, username);
        fs.mkdirSync(folder_path, { recursive: true });
        
        return res.status(200).json({ token });
    } else {
        return res.status(403).json({ message: "User already exists" });
    }
});