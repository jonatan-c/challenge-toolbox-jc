const { expect } = require('chai');
const sinon = require('sinon');
const request = require('http');
const app = require('../src/app');
const filesService = require('../src/services/filesService');

let server;
let baseUrl;

before((done) => {
  server = app.listen(0, () => {
    baseUrl = `http://localhost:${server.address().port}`;
    done();
  });
});

after((done) => {
  server.close(done);
});

afterEach(() => {
  sinon.restore();
});

function get(path) {
  return new Promise((resolve, reject) => {
    request.get(`${baseUrl}${path}`, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, body, headers: res.headers });
      });
    }).on('error', reject);
  });
}

describe('GET /files/data', () => {
  it('returns 200 with JSON content-type', async () => {
    sinon.stub(filesService, 'getFilesData').resolves([]);
    const res = await get('/files/data');
    expect(res.statusCode).to.equal(200);
    expect(res.headers['content-type']).to.include('application/json');
  });

  it('returns an array of file objects', async () => {
    const mockData = [
      {
        file: 'file1.csv',
        lines: [
          { text: 'RgTya', number: 64075909, hex: '70ad29aacf0b690b0467fe2b2767f765' },
        ],
      },
    ];
    sinon.stub(filesService, 'getFilesData').resolves(mockData);
    const res = await get('/files/data');
    const parsed = JSON.parse(res.body);
    expect(parsed).to.be.an('array').with.length(1);
    expect(parsed[0]).to.have.property('file', 'file1.csv');
    expect(parsed[0].lines[0]).to.deep.equal({
      text: 'RgTya',
      number: 64075909,
      hex: '70ad29aacf0b690b0467fe2b2767f765',
    });
  });

  it('returns 500 when service throws', async () => {
    sinon.stub(filesService, 'getFilesData').rejects(new Error('External API down'));
    const res = await get('/files/data');
    expect(res.statusCode).to.equal(500);
    const parsed = JSON.parse(res.body);
    expect(parsed).to.have.property('error');
  });

  it('returns empty array when no valid files found', async () => {
    sinon.stub(filesService, 'getFilesData').resolves([]);
    const res = await get('/files/data');
    const parsed = JSON.parse(res.body);
    expect(parsed).to.be.an('array').with.length(0);
  });
});
