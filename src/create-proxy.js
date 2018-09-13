const httpProxy = require('http-proxy');
const writeError = require('./write-error');

module.exports = apiKey => {
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
