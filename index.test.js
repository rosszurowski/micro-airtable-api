const http = require('http');
const supertest = require('supertest');
const handler = require('./src/handler');
const parseEnv = require('./src/parse-env');

const describeIfEnv = (process.env.AIRTABLE_API_KEY && process.env.AIRTABLE_BASE_ID) ? describe : xdescribe;

describeIfEnv('handler', () => {

  describe('allowedMethods "*"', () => {
    this.config = parseEnv(process.env);
    this.config.allowedMethods = '*';

    it('Can make GET request', () => {
      const server = http.createServer(handler(this.config));

      supertest(server)
      .get('http://localhost:3000/v0/Posts')
      .expect(200)
      .end(function (err, res) {
        console.log(err ? 'has error' : 'no error');
        console.log(res);
      });
    });

    it('Knows true', () => {
      expect(true).toBeTruthy();
    })
  });
});
