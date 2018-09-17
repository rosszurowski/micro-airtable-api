const http = require('http');
const supertest = require('supertest');
const handler = require('./index');

const describeIfEnv = (process.env.AIRTABLE_API_KEY && process.env.AIRTABLE_BASE_ID) ? describe : xdescribe;
const baseConfig = {
  airtableBaseId: process.env.AIRTABLE_BASE_ID,
  airtableApiKey: process.env.AIRTABLE_API_KEY,
};

const getExistingPosts = async (server) => {
  return (await supertest(server).get('/v0/Posts')).body;
};

describeIfEnv('micro-airtable-api', () => {

  describe('when `allowedMethods="*"`', () => {
    let server;

    beforeEach(() => {
      const config = {...baseConfig, allowedMethods: '*'};
      server = http.createServer(handler(config));
    });

    describe('GET /v0/Posts', () => {
      let response;

      beforeEach(async () => {
        response = await supertest(server).get('/v0/Posts');
      });

      it('returns successful response', () => expect(response.statusCode).toBe(200));
      it('contains a response body', () => expect(response.body).toBeTruthy());
    });

    describe('POST /v0/Posts', () => {
      let response;

      beforeEach(async () => {
        response = await supertest(server)
          .post('/v0/Posts')
          .send({fields: {title: 'Test POST request'}});
      });

      it('returns successful response', () => expect(response.statusCode).toBe(200));
      it('contains a response body', () => expect(response.body).toBeTruthy());
    });

    describe('PUT /v0/Posts/:id', () => {
      let response;

      beforeEach(async () => {
        const post = (await getExistingPosts(server)).records[0];
        response = await supertest(server)
          .put(`/v0/Posts/${post.id}`)
          .send({fields: {title: 'Test PUT request'}});
      });

      it('returns successful response', () => expect(response.statusCode).toBe(200));
      it('contains a response body', () => expect(response.body).toBeTruthy());
    });

    describe('PATCH /v0/Posts/:id', () => {
      let response;

      beforeEach(async () => {
        const post = (await getExistingPosts(server)).records[0];
        response = await supertest(server)
          .patch(`/v0/Posts/${post.id}`)
          .send({fields: {title: 'Test PATCH request'}});
      });

      it('returns successful response', () => expect(response.statusCode).toBe(200));
      it('contains a response body', () => expect(response.body).toBeTruthy());
    });

    describe('DELETE /v0/Posts/:id', () => {
      let response;

      beforeEach(async () => {
        const post = (await getExistingPosts(server)).records[0];
        response = await supertest(server).delete(`/v0/Posts/${post.id}`);
      });


      it('returns successful response', () => expect(response.statusCode).toBe(200));
      it('contains a response body', () => expect(response.body).toBeTruthy());
    });
  });
});
