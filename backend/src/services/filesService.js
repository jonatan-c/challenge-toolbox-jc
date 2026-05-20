const { listFiles, downloadFile } = require('./externalApi');
const { parseCsv } = require('./csvParser');

async function getFilesData() {
  const files = await listFiles();

  const results = await Promise.allSettled(
    files.map(async (filename) => {
      const content = await downloadFile(filename);

      return parseCsv(content, filename);
    })
  );

  return results
    .filter((r) => r.status === 'fulfilled' && r.value !== null)
    .map((r) => r.value);
}

module.exports = { getFilesData };
