const { expect } = require('chai');
const { parseCsv } = require('../src/services/csvParser');

describe('parseCsv', () => {
  const filename = 'file1.csv';

  it('returns null for empty content', () => {
    expect(parseCsv('', filename)).to.be.null;
    expect(parseCsv(null, filename)).to.be.null;
  });

  it('returns null when only header is present', () => {
    expect(parseCsv('file,text,number,hex', filename)).to.be.null;
  });

  it('parses valid lines correctly', () => {
    const csv = [
      'file,text,number,hex',
      'file1.csv,RgTya,64075909,70ad29aacf0b690b0467fe2b2767f765',
      'file1.csv,AtjW,6,d33a8ca5d36d3106219f66f939774cf5',
    ].join('\n');

    const result = parseCsv(csv, filename);
    expect(result).to.deep.equal({
      file: 'file1.csv',
      lines: [
        { text: 'RgTya', number: 64075909, hex: '70ad29aacf0b690b0467fe2b2767f765' },
        { text: 'AtjW', number: 6, hex: 'd33a8ca5d36d3106219f66f939774cf5' },
      ],
    });
  });

  it('discards lines with missing fields', () => {
    const csv = [
      'file,text,number,hex',
      'file1.csv,RgTya,64075909,70ad29aacf0b690b0467fe2b2767f765',
      'file1.csv,incomplete',
    ].join('\n');

    const result = parseCsv(csv, filename);
    expect(result.lines).to.have.length(1);
  });

  it('discards lines with invalid hex (not 32 chars)', () => {
    const csv = [
      'file,text,number,hex',
      'file1.csv,RgTya,64075909,tooshort',
      'file1.csv,AtjW,6,d33a8ca5d36d3106219f66f939774cf5',
    ].join('\n');

    const result = parseCsv(csv, filename);
    expect(result.lines).to.have.length(1);
    expect(result.lines[0].text).to.equal('AtjW');
  });

  it('discards lines with non-numeric number field', () => {
    const csv = [
      'file,text,number,hex',
      'file1.csv,RgTya,notanumber,70ad29aacf0b690b0467fe2b2767f765',
      'file1.csv,AtjW,6,d33a8ca5d36d3106219f66f939774cf5',
    ].join('\n');

    const result = parseCsv(csv, filename);
    expect(result.lines).to.have.length(1);
  });

  it('returns null when all lines are invalid', () => {
    const csv = [
      'file,text,number,hex',
      'bad,data',
    ].join('\n');

    expect(parseCsv(csv, filename)).to.be.null;
  });
});
