const express = require('express')
const filesService = require('../services/filesService')
const { listFiles } = require('../services/externalApi')

const router = express.Router()

router.get('/list', async (req, res) => {
  try {
    const files = await listFiles()
    res.json({ files })
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve file list' })
  }
})

router.get('/data', async (req, res) => {
  try {
    const { fileName } = req.query
    const data = await filesService.getFilesData(fileName)
    res.json(data)
  } catch (err) {
    if (err.notFound) return res.status(404).json({ error: err.message })
    res.status(500).json({ error: 'Failed to retrieve files data' })
  }
})

module.exports = router
