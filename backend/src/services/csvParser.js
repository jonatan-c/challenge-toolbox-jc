const HEX_32_REGEX = /^[0-9a-f]{32}$/i;

function parseLine(line) {
  const [file, text, numberStr, hex] = line.split(',');
  if (!file || !text || !numberStr || !hex) return null;
  const number = Number(numberStr);
  if (!Number.isFinite(number)) return null;
  if (!HEX_32_REGEX.test(hex.trim())) return null;
  return { text: text.trim(), number, hex: hex.trim() };
}

function parseCsv(content, filename) {
  if (!content || typeof content !== 'string') return null;

  const lines = content.split('\n').map((l) => l.trim()).filter(Boolean);
  if (lines.length < 2) return null;

  const validLines = lines.slice(1).map(parseLine).filter(Boolean);
  if (validLines.length === 0) return null;

  return { file: filename, lines: validLines };
}

module.exports = { parseCsv };
