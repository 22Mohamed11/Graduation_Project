const router = require("express").Router();
const multer = require('multer');
const classifyImage = require('./classify_image');

// Multer setup to handle file uploads
const upload = multer({ dest: 'uploads/' });

exports.app.post('/classify', upload.single('image'), async (req, res) => {
     try {
       const result = await classifyImage(req.file.path);
       res.json(result);
     } catch (error) {
       console.error(error);
       res.status(500).json({ error: 'Internal Server Error' });
     }
   });