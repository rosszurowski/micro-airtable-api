#!/usr/bin/env node

require('dotenv').config({ path: __dirname + '/../.env' });
const http = require('http');
const handler = require('../src/handler');
const parseEnv = require('../src/parse-env');

process.on('uncaughtException', err => {
  exit(err);
});

const config = parseEnv(process.env);
const server = http.createServer(handler(config));

server.listen(config.port, err => {
  if (err) {
    exit(err);
    return;
  }

  console.log(
    `> micro-airtable-api listening on http://localhost:${config.port}`
  );
});

function exit(err) {
  console.error('Error:', err.message);
  process.exit(1);
}
