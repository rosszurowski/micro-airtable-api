#! /usr/bin/env node

require('dotenv').config();
const http = require('http');
const handler = require('../src/handler');
const getConfig = require('../src/config');

let config;

try {
  config = getConfig(process.env);
} catch (err) {
  exit(err);
}

const server = http.createServer(handler(config));

server.listen(config.port, err => {
  if (err) {
    exit(err);
    return;
  }

  console.log(`micro-airtable-api listening on port ${config.port}`);
});

function exit(err) {
  console.error('Error:', err.message);
  process.exit(1);
}
