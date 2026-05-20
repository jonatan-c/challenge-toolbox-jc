const express = require('express');
const filesService = require('../services/filesService');

const router = express.Router();

router.get('/data', async (req, res) => {
  try {
    const data = await filesService.getFilesData();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve files data' });
  }
});

module.exports = router;
