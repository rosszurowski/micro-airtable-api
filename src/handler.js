const parse = require('url').parse;
const httpProxy = require('http-proxy');
const route = require('path-match')();
const getConfig = require('./config');
const { isObject, compact } = require('./utils');

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

const match = route('/:version/:tableName/:recordId?');
const parseUrl = (originalUrl, airtableBaseId) => {
  const components = parse(originalUrl);
  const params = match(components.pathname);

  if (params === false) {
    const originalPath = components.path;
    return { url: originalPath, tableName: false };
  }

  const proxyUrl =
    '/' +
    compact([
      params.version,
      airtableBaseId,
      params.tableName,
      params.recordId,
      components.search,
    ]).join('/');

  return {
    proxyUrl,
    tableName: params.tableName,
  };
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

    const { proxyUrl, tableName } = parseUrl(req.url, config.airtableBaseId);
    const tablePermissions = getTablePermissions(config, tableName);

    req.url = proxyUrl;

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
