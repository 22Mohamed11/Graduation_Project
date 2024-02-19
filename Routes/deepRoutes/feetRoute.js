/*const router = require("express").Router();
const multer = require('multer');
const classifyImage = require('../../Controllers/deepControllers/feetController');

// Multer setup to handle file uploads
const upload = multer({ dest: 'uploads/' });

router.post('/classify', upload.single('image'), async (req, res) => {
     try {
       const result = await classifyImage.classifyImage(req.file.path);
       res.json(result);
     } catch (error) {
       console.error(error);
       res.status(500).json({ error: 'Internal Server Error' });
     }
   });

   module.exports = router;*/