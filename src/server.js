const http = require('http');
const handler = require('./handler');

module.exports = config => http.createServer(handler(config));
