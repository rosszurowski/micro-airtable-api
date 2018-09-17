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

describeIfEnv('integration', () => {

  describe('allowedMethods "*"', () => {
    let server;

    beforeEach(() => {
      const config = {...baseConfig, allowedMethods: '*'};
      server = http.createServer(handler(config));
    });

    it('Can make GET request', async () => {
      this.response = await supertest(server)
        .get('/v0/Posts');

      expect(this.response.statusCode).toBe(200);
      expect(this.response.body).toBeTruthy();
    });

    it('Can make POST request', async () => {
      this.response = await supertest(server)
        .post('/v0/Posts')
        .send({fields: {title: 'Test POST request'}});

      expect(this.response.statusCode).toBe(200);
      expect(this.response.body).toBeTruthy();
    });

    it('Can make PUT request', async () => {
      const post = (await getExistingPosts(server)).records[0];

      this.response = await supertest(server)
        .put(`/v0/Posts/${post.id}`)
        .send({fields: {title: 'Test PUT request'}});

      expect(this.response.statusCode).toBe(200);
      expect(this.response.body).toBeTruthy();
    });

    it('Can make PATCH request', async () => {
      const post = (await getExistingPosts(server)).records[0];

      this.response = await supertest(server)
      .patch(`/v0/Posts/${post.id}`)
      .send({fields: {title: 'Test PATCH request'}});

      expect(this.response.statusCode).toBe(200);
      expect(this.response.body).toBeTruthy();
    });

    it('Can make DELETE request', async () => {
      const post = (await getExistingPosts(server)).records[0];

      this.response = await supertest(server)
      .delete(`/v0/Posts/${post.id}`);

      expect(this.response.statusCode).toBe(200);
      expect(this.response.body).toBeTruthy();
    });
  });
});
