const express = require('express');
const multer = require('multer');
const path = require('path');
const { uploadFile } = require('../controllers/emailController');

const router = express.Router();

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// POST /api/email/send
router.post('/send', upload.array('attachments'), uploadFile);

module.exports = router;
