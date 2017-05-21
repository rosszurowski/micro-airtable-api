require('dotenv').config();
const assert = require('assert');
const http = require('http');
const httpProxy = require('http-proxy');
const parse = require('url').parse;
const route = require('path-match')();

const isUndefined = val => typeof val === 'undefined';

const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const PORT = process.env.PORT || 3000;

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
  res.end(JSON.stringify(`An unknown error occurred: ${err.message}`));
});

const match = route('/:version/*');
const server = http.createServer((req, res) => {
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

  console.log(`micro-airtable-proxy listening on port ${PORT}`);
});
