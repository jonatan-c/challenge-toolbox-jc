const axios = require('axios')
const { API_BASE_URL, API_KEY } = require('../config')

const headers = { authorization: API_KEY }

async function listFiles () {
  const response = await axios.get(`${API_BASE_URL}/files`, { headers })
  return response.data.files
}

async function downloadFile (filename) {
  const response = await axios.get(`${API_BASE_URL}/file/${filename}`, { headers })
  return response.data
}

module.exports = { listFiles, downloadFile }
