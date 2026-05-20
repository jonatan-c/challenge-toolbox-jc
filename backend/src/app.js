const express = require('express')
const filesRouter = require('./routes/files')

const app = express()

app.use(express.json())
app.use('/files', filesRouter)

module.exports = app
