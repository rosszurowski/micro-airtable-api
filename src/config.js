const isUndefined = val => typeof val === 'undefined';

const {
  AIRTABLE_BASE_ID,
  AIRTABLE_API_KEY,
  ALLOWED_METHODS = ['GET', 'PUT', 'POST', 'PATCH', 'DELETE'].join(','),
  PORT = 3000,
  READ_ONLY,
} = process.env;

const allowedMethods = READ_ONLY === 'true' ? ['GET'] : ALLOWED_METHODS.split(',');

if (isUndefined(AIRTABLE_BASE_ID) || isUndefined(AIRTABLE_API_KEY)) {
  console.error(`Error: Please provide AIRTABLE_BASE_ID and AIRTABLE_API_KEY as environment variables.`);
  process.exit(1);
}

module.exports = {
  airtableApiKey: AIRTABLE_API_KEY,
  airtableBaseId: AIRTABLE_BASE_ID,
  allowedMethods,
  port: PORT,
};
