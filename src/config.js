const isUndefined = val => typeof val === 'undefined';

module.exports = env => {
  const {
    AIRTABLE_BASE_ID,
    AIRTABLE_API_KEY,
    ALLOWED_METHODS = ['GET', 'PUT', 'POST', 'PATCH', 'DELETE'].join(','),
    PORT = 3000,
    READ_ONLY,
  } = env;

  if (isUndefined(AIRTABLE_BASE_ID) || isUndefined(AIRTABLE_API_KEY)) {
    throw new Error(
      'Please provide AIRTABLE_BASE_ID and AIRTABLE_API_KEY as environment variables.'
    );
  }

  const allowedMethods =
    READ_ONLY === 'true' ? ['GET'] : ALLOWED_METHODS.split(',');

  return {
    airtableApiKey: AIRTABLE_API_KEY,
    airtableBaseId: AIRTABLE_BASE_ID,
    allowedMethods,
    port: PORT,
  };
};
