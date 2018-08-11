const isUndefined = val => typeof val === 'undefined';

const AIRTABLE_HTTP_METHODS = ['GET', 'PUT', 'POST', 'PATCH', 'DELETE'];
const AIRTABLE_HTTP_HEADERS = ['Content-Type', 'Authorization', 'Content-Length', 'X-Requested-With', 'X-API-Version', 'X-Airtable-Application-ID', 'User-Agent', 'X-Airtable-User-Agent'];

const {
  AIRTABLE_BASE_ID,
  AIRTABLE_API_KEY,
  ALLOWED_METHODS = AIRTABLE_HTTP_METHODS.join(','),
  PORT = 3000,
  READ_ONLY,
} = process.env;

const allowedMethods = READ_ONLY === 'true' ? ['GET'] : ALLOWED_METHODS.split(',');
const allMethods = ['OPTIONS', ...allowedMethods];

if (isUndefined(AIRTABLE_BASE_ID) || isUndefined(AIRTABLE_API_KEY)) {
  console.error(`Error: Please provide AIRTABLE_BASE_ID and AIRTABLE_API_KEY as environment variables.`);
  process.exit(1);
}

module.exports = {
  ALLOWED_METHODS,
  AIRTABLE_API_KEY,
  AIRTABLE_BASE_ID,
  AIRTABLE_HTTP_HEADERS,
  AIRTABLE_HTTP_METHODS,
  PORT,
  READ_ONLY,
  allowedMethods,
  allMethods
};
