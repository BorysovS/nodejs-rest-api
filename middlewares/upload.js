const multer = require('multer');

const path = require('path');

const tempDir = path.resolve("temp");

const storage = multer.diskStorage({
    destination: tempDir,
    filename: (req, file, cb) => { 
        const uniqePrefix = Date.now();
        const newName = `${uniqePrefix}_${file.originalname}`;
        cb(null, newName)
    }
});

const upload = multer({ storage: storage });

module.exports = upload;
