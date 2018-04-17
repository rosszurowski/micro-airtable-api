require('dotenv').config();

const http = require('http');
const httpProxy = require('http-proxy');
const parse = require('url').parse;
const route = require('path-match')();

const isUndefined = val => typeof val === 'undefined';

const AIRTABLE_HTTP_METHODS = ['GET', 'PUT', 'POST', 'PATCH', 'DELETE'];
const AIRTABLE_HTTP_HEADERS = ['Content-Type', 'Authorization', 'Content-Length', 'X-Requested-With', 'X-Api-Version', 'X-Airtable-Application-Id', 'User-Agent', 'X-Airtable-User-Agent']

const {
  AIRTABLE_BASE_ID,
  AIRTABLE_API_KEY,
  ALLOWED_METHODS = AIRTABLE_HTTP_METHODS.join(','),
  PORT = 3000,
  READ_ONLY,
} = process.env;

const allowedMethods = READ_ONLY === 'true' ? ['GET'] : ALLOWED_METHODS.split(',');
const allMethods = ['OPTIONS', ...allowedMethods];

if (isUndefined(AIRTABLE_BASE_ID) || isUndefined(AIRTABLE_API_KEY)) {
  console.error(`Error: Please provide AIRTABLE_BASE_ID and AIRTABLE_API_KEY as environment variables.`);
  process.exit(1);
}

const proxy = httpProxy.createProxyServer({
  changeOrigin: true,
  headers: {
    'Accept': 'application/json',
    'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
  },
  target: 'https://api.airtable.com',
  secure: false,
  ssl: {
    rejectUnauthorized: false
  },
});

proxy.on('error', (err, req, res) => {
  res.writeHead(500, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    code: 'Internal Server Error',
    message: `An unknown error occurred: ${err.message}`
  }));
});

const match = route('/:version/*');
const server = http.createServer((req, res) => {
  const method = req.method && req.method.toUpperCase && req.method.toUpperCase();

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Request-Method', '*');
  res.setHeader('Access-Control-Allow-Methods', allMethods.join(','));
  res.setHeader('Access-Control-Allow-Headers', AIRTABLE_HTTP_HEADERS.join(','));

  if (method === 'OPTIONS') {
    res.setHeader('Content-Length', '0');
    res.writeHead(204);
    res.end();
    return;
  }

  if (!allowedMethods.includes(method)) {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      code: 'Method Not Allowed',
      message: `This API does not allow '${req.method}' requests`
    }))
    return;
  }

  const originalPath = parse(req.url).path;
  const params = match(originalPath);
  const rest = params[0] || '';

  let path = originalPath;

  if (params !== false) {
    path = `/${params.version}/${AIRTABLE_BASE_ID}/${rest}`;
  }

  req.url = path;

  proxy.web(req, res);
});

server.listen(PORT, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  console.log(`micro-airtable-api listening on port ${PORT}`);
});
