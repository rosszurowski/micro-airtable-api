const parse = require('url').parse;
const httpProxy = require('http-proxy');
const route = require('path-match')();
const getConfig = require('./config');
const { isObject } = require('./utils');

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

const getTablePermissions = (config, tableName) => {
  if (!tableName) {
    return '*';
  }

  const hasRouteSpecificConfig = isObject(config.allowedMethods);

  return hasRouteSpecificConfig
    ? config.allowedMethods[tableName] || []
    : config.allowedMethods;
};

const isAllowed = (permissions, method) => {
  if (permissions === '*') {
    return true;
  }

  if (Array.isArray(permissions) && permissions.includes(method)) {
    return true;
  }

  return false;
};

module.exports = options => {
  const config = getConfig(options);
  const proxy = createProxy(config.airtableApiKey);

  return (req, res) => {
    const method =
      req.method && req.method.toUpperCase && req.method.toUpperCase();

    const components = parse(req.url);
    const originalPath = components.path;
    const params = match(originalPath);
    const rest = params[0] || '';

    let path = originalPath;
    let tableName = null;

    if (params !== false) {
      tableName = rest.split('?').shift();
      path = `/${params.version}/${config.airtableBaseId}/${rest}`;
    }

    const tablePermissions = getTablePermissions(config, tableName);

    req.url = path;

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Request-Method', '*');
    res.setHeader(
      'Access-Control-Allow-Methods',
      ['OPTIONS', ...tablePermissions].join(',')
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

    if (!isAllowed(tablePermissions, method)) {
      writeError(
        res,
        405,
        'Method Not Allowed',
        `This API does not allow '${method}' requests for '${tableName}'`
      );
      return;
    }

    proxy.web(req, res);
  };
};
