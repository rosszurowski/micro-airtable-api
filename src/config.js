const { isObject } = require('./utils');

const invariant = (condition, err) => {
  if (condition) {
    return;
  }

  throw err;
};

const defaultConfig = {
  airtableApiKey: null,
  airtableBaseId: null,
  allowedMethods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE'],
};

module.exports = inputConfig => {
  const config = Object.assign({}, defaultConfig, inputConfig);

  invariant(
    typeof config.airtableApiKey === 'string',
    new TypeError('config.airtableApiKey must be a string')
  );
  invariant(
    typeof config.airtableBaseId === 'string',
    new TypeError('config.airtableBaseId must be a string')
  );
  invariant(
    Array.isArray(config.allowedMethods) ||
      isObject(config.allowedMethods) ||
      config.allowedMethods === '*',
    new TypeError('config.allowedMethods must be an array or object')
  );

  return config;
};
