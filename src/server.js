const http = require('http');
const httpProxy = require('http-proxy');
const parse = require('url').parse;
const route = require('path-match')();

const ALLOWED_HTTP_HEADERS = [
  'Authorization',
  'Content-Type',
  'Content-Length',
  'User-Agent',
  'X-Airtable-Application-ID',
  'X-Airtable-User-Agent',
  'X-API-Version',
  'X-Requested-With',
];

const match = route('/:version/*');

const writeError = (res, status, code, message) => {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ code, message }));
};

module.exports = function (config) {
  const proxy = httpProxy.createProxyServer({
    changeOrigin: true,
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${config.airtableApiKey}`,
    },
    target: 'https://api.airtable.com',
    secure: false,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  proxy.on('error', (err, req, res) => {
    writeError(res, 500, 'Internal Server Error', `An unknown error occurred: ${err.message}`);
  });

  const handler = (req, res) => {
    const method =
      req.method && req.method.toUpperCase && req.method.toUpperCase();

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Request-Method', '*');
    res.setHeader(
      'Access-Control-Allow-Methods',
      ['OPTIONS', ...config.allowedMethods].join(','),
    );
    res.setHeader(
      'Access-Control-Allow-Headers',
      ALLOWED_HTTP_HEADERS.join(','),
    );

    if (method === 'OPTIONS') {
      res.setHeader('Content-Length', '0');
      res.writeHead(204);
      res.end();
      return;
    }

    if (!config.allowedMethods.includes(method)) {
      writeError(res, 405, 'Method Not Allowed', `This API does not allow '${req.method}' requests`);
      return;
    }

    const originalPath = parse(req.url).path;
    const params = match(originalPath);
    const rest = params[0] || '';

    let path = originalPath;

    if (params !== false) {
      path = `/${params.version}/${config.airtableBaseId}/${rest}`;
    }

    req.url = path;

    proxy.web(req, res);
  };

  return http.createServer(handler);
};
