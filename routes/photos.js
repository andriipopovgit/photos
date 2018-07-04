const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user.js');
const jwt = require('jsonwebtoken');
const config = require('../config/config.js');
const bodyParser = require('body-parser');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');

const mongoURI = 'mongodb://127.0.0.1:27017/photos';

// Create mongo connection
const conn = mongoose.createConnection(mongoURI);

// Init gfs
let gfs;

conn.once('open', () => {
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});

// Create storage engine
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});
const upload = multer({ storage });

router.get('/photos', function(req, res, next) {
    console.log("get_photos");
    console.log(req.decoded);
    var images = [
        "https://dummyimage.com/600x400/000/0ff",
        "https://dummyimage.com/600x400/000/f0f",
        "https://dummyimage.com/600x400/000/ff0"
    ];
    res.json({ success: true, images: images });
});

router.post('/photos', upload.single('file'), (req, res) => {
    // res.json({ file: req.file });
    return res.json({success: true});
  });

module.exports = router;