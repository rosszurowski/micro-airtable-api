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

const invariant = (condition, err) => {
  if (condition) {
    return;
  }

  throw err;
};

const match = route('/:version/*');

const writeError = (res, status, code, message) => {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ code, message }));
};

const createProxy = apiKey => {
  const proxy = httpProxy.createProxyServer({
    changeOrigin: true,
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    target: 'https://api.airtable.com',
    secure: false,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  proxy.on('error', (err, req, res) => {
    writeError(
      res,
      500,
      'Internal Server Error',
      `An unknown error occurred: ${err.message}`
    );
  });

  return proxy;
};

const defaultConfig = {
  allowedMethods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE'],
};

module.exports = options => {
  const config = Object.assign({}, defaultConfig, options);

  invariant(
    typeof config.airtableApiKey === 'string',
    new TypeError('config.airtableApiKey must be a string')
  );
  invariant(
    typeof config.airtableBaseId === 'string',
    new TypeError('config.airtableBaseId must be a string')
  );
  invariant(
    Array.isArray(config.allowedMethods),
    new TypeError('config.allowedMethods must be an array')
  );

  const proxy = createProxy(config.airtableApiKey);

  return (req, res) => {
    const method =
      req.method && req.method.toUpperCase && req.method.toUpperCase();

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Request-Method', '*');
    res.setHeader(
      'Access-Control-Allow-Methods',
      ['OPTIONS', ...config.allowedMethods].join(',')
    );
    res.setHeader(
      'Access-Control-Allow-Headers',
      ALLOWED_HTTP_HEADERS.join(',')
    );

    if (method === 'OPTIONS') {
      res.setHeader('Content-Length', '0');
      res.writeHead(204);
      res.end();
      return;
    }

    if (!config.allowedMethods.includes(method)) {
      writeError(
        res,
        405,
        'Method Not Allowed',
        `This API does not allow '${req.method}' requests`
      );
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
};
