function isJson(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

module.exports = env => {
  const {
    AIRTABLE_BASE_ID,
    AIRTABLE_API_KEY,
    ALLOWED_METHODS,
    PORT = 3000,
    READ_ONLY,
  } = env;

  if (
    typeof AIRTABLE_BASE_ID === 'undefined' ||
    typeof AIRTABLE_API_KEY === 'undefined'
  ) {
    throw new TypeError(
      'Please provide AIRTABLE_BASE_ID and AIRTABLE_API_KEY as environment variables.'
    );
  }

  const config = {
    airtableApiKey: AIRTABLE_API_KEY,
    airtableBaseId: AIRTABLE_BASE_ID,
    port: PORT,
  };

  if (READ_ONLY === 'true') {
    config.allowedMethods = ['GET'];
  } else if (ALLOWED_METHODS) {
    if (isJson(ALLOWED_METHODS)) {
      // Allows JSON in the environment variable
      // eg: ALLOWED_METHODS='{"Posts": ["GET", "PUT"],"Comments": "*"}'
      config.allowedMethods = JSON.parse(ALLOWED_METHODS);
    } else {
      config.allowedMethods = ALLOWED_METHODS.split(',');
    }
  }

  return config;
};
