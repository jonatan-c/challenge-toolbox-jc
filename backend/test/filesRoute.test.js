const { expect } = require('chai');
const sinon = require('sinon');
const request = require('http');
const app = require('../src/app');
const filesService = require('../src/services/filesService');
const externalApi = require('../src/services/externalApi');

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


  it('filters by fileName query param and returns matching data', async () => {
    const mockData = [{ file: 'file1.csv', lines: [{ text: 'hello', number: 1, hex: 'a3f1b2c4d5e6f7a8b9c0d1e2f3a4b5c6' }] }];

    sinon.stub(filesService, 'getFilesData').resolves(mockData);
    const res = await get('/files/data?fileName=file1.csv');
    const parsed = JSON.parse(res.body);

    expect(res.statusCode).to.equal(200);
    expect(parsed[0]).to.have.property('file', 'file1.csv');
  });

  it('returns 404 when fileName query param does not match any file', async () => {
    sinon.stub(filesService, 'getFilesData').resolves([]);
    const res = await get('/files/data?fileName=noexiste.csv');
    const parsed = JSON.parse(res.body);
    
    expect(res.statusCode).to.equal(404);
    expect(parsed).to.have.property('error');
  });

  it('returns 404 when service throws a notFound error', async () => {
    
    const err = new Error('File not found');
    err.notFound = true;
    sinon.stub(filesService, 'getFilesData').rejects(err);
    const res = await get('/files/data?fileName=noexiste.csv');
    const parsed = JSON.parse(res.body);
    
    expect(res.statusCode).to.equal(404);
    expect(parsed).to.have.property('error');
  });
});

describe('GET /files/list', () => {
  it('returns 200 with list of files', async () => {
    
    sinon.stub(externalApi, 'listFiles').resolves(['test1.csv', 'test2.csv', 'test3.csv' , 'test18.csv' , 'test4.csv' , 'test5.csv' , 'test6.csv', 'test9.csv' ]);
    const res = await get('/files/list');
    const parsed = JSON.parse(res.body);
    
    expect(res.statusCode).to.equal(200);
    expect(parsed).to.have.property('files').that.deep.equals(['test1.csv', 'test2.csv', 'test3.csv' , 'test18.csv' , 'test4.csv' , 'test5.csv' , 'test6.csv', 'test9.csv' ]);
  });

  it('returns 500 when listFiles throws', async () => {
    
    sinon.stub(externalApi, 'listFiles').rejects(new Error('External API down'));
    const res = await get('/files/list');
    const parsed = JSON.parse(res.body);
    
    expect(res.statusCode).to.equal(500);
    expect(parsed).to.have.property('error');
  });
});

