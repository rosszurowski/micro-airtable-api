const parse = require('url').parse;
const route = require('path-match')();
const getConfig = require('./config');
const createProxy = require('./create-proxy');
const writeError = require('./write-error');

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

module.exports = options => {
  const config = getConfig(options);
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
