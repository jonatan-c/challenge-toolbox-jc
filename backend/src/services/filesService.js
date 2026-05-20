const { listFiles, downloadFile } = require('./externalApi')
const { parseCsv } = require('./csvParser')

async function getFilesData (fileName) {
  const files = await listFiles()

  if (fileName && !files.includes(fileName)) {
    const err = new Error(`File '${fileName}' not found`)
    err.notFound = true
    throw err
  }

  const targets = fileName ? [fileName] : files

  const results = await Promise.allSettled(
    targets.map(async (filename) => {
      const content = await downloadFile(filename)
      return parseCsv(content, filename)
    })
  )

  return results
    .filter((r) => r.status === 'fulfilled' && r.value !== null)
    .map((r) => r.value)
}

module.exports = { getFilesData }
