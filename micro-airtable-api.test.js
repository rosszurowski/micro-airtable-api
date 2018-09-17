const http = require('http');
const got = require('got');
const listen = require('test-listen');
const handler = require('./index');

const describeIfEnv = (process.env.AIRTABLE_API_KEY && process.env.AIRTABLE_BASE_ID) ? describe : xdescribe;
const baseConfig = {
  airtableBaseId: process.env.AIRTABLE_BASE_ID,
  airtableApiKey: process.env.AIRTABLE_API_KEY,
};

const getExistingPosts = async (client) => {
  return (await client.get('/v0/Posts', {json: true})).body;
};

describeIfEnv('micro-airtable-api', () => {

  describe('when `allowedMethods="*"`', () => {
    const config = {...baseConfig, allowedMethods: '*'};
    let server;
    let client;

    beforeAll(async () => {
      server = http.createServer(handler(config));
      const baseUrl = await listen(server);
      client = got.extend({ baseUrl });
    });

    describe('GET /v0/Posts', () => {
      it('returns successful response', async () => {
        await client.get('/v0/Posts');
      });
    });

    describe('POST /v0/Posts', () => {
      it('returns successful response', async () => {
        await client.post('/v0/Posts', {
          json: true,
          headers: {'Content-type': 'application/json'},
          body: {fields: {title: 'Test POST request'}},
        });
      });
    });

    describe('PUT /v0/Posts/:id', () => {
      it('returns successful response', async () => {
        const post = (await getExistingPosts(client)).records[0];

        await client.put(`/v0/Posts/${post.id}`, {
          json: true,
          headers: {'Content-type': 'application/json'},
          body: {fields: {title: 'Test PUT request'}},
        });
      });
    });

    describe('PATCH /v0/Posts/:id', () => {
      it('returns successful response', async () => {
        const post = (await getExistingPosts(client)).records[0];

        await client.patch(`/v0/Posts/${post.id}`, {
          json: true,
          headers: {'Content-type': 'application/json'},
          body: {fields: {title: 'Test PATCH request'}},
        });
      });
    });

    describe('DELETE /v0/Posts/:id', () => {
      it('returns successful response', async () => {
        const post = (await getExistingPosts(client)).records[0];

        await client.delete(`/v0/Posts/${post.id}`);
      });
    });
  });
});
