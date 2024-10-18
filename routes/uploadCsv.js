const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const express = require('express');
const router = express.Router();
const Item = require('../models/Item'); // MongoDB model

const upload = multer({ dest: 'uploads/' });

router.post('/api/items/upload-csv', upload.single('file'), (req, res) => {
  const results = [];

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      try {
        await Item.insertMany(results); // Bulk insert data
        res.status(200).json({ message: 'Items added successfully' });
      } catch (error) {
        console.error('Error uploading items:', error);
        res.status(500).json({ message: 'Failed to upload items' });
      }
    });
});

module.exports = router;