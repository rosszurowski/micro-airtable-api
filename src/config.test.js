describe('config', () => {
  let config;
  let defaultConfig;

  beforeEach(() => {
    process.env = {};
    jest.resetModules();
    defaultConfig = {
      ALLOWED_METHODS: 'GET,PUT,POST,PATCH,DELETE',
      AIRTABLE_API_KEY: 'YourApiKey',
      AIRTABLE_BASE_ID: 'YourBaseId',
      AIRTABLE_HTTP_HEADERS: [
        'Content-Type',
        'Authorization',
        'Content-Length',
        'X-Requested-With',
        'X-API-Version',
        'X-Airtable-Application-ID',
        'User-Agent',
        'X-Airtable-User-Agent'
      ],
      AIRTABLE_HTTP_METHODS: [ 'GET', 'PUT', 'POST', 'PATCH', 'DELETE' ],
      PORT: 3000,
      READ_ONLY: undefined,
      allowedMethods: [ 'GET', 'PUT', 'POST', 'PATCH', 'DELETE' ],
      allMethods: [ 'OPTIONS', 'GET', 'PUT', 'POST', 'PATCH', 'DELETE' ],
    };
  });

  it('returns the default config when only API Key and Base ID are set', () => {
    process.env = {
      AIRTABLE_API_KEY: 'YourApiKey',
      AIRTABLE_BASE_ID: 'YourBaseId',
    };

    config = require('./config');

    expect(config).not.toBeNull();
    expect(config).toEqual(defaultConfig);
  });

  it('throws an error when no env variables set', () => {
    const exit = jest.spyOn(process, 'exit').mockImplementation(() => undefined);
    const err = jest.spyOn(console, 'error').mockImplementation(() => undefined);

    config = require('./config');

    expect(exit).toHaveBeenCalledWith(1);
    expect(err).toHaveBeenCalledWith('Error: Please provide AIRTABLE_BASE_ID and AIRTABLE_API_KEY as environment variables.');
  });

  it('returns the correct config when env variables are set', () => {
    process.env = {
      ALLOWED_METHODS: 'GET,POST,DELETE',
      AIRTABLE_API_KEY: 'YourApiKey',
      AIRTABLE_BASE_ID: 'YourBaseId',
      PORT: 3001,
    };
    const expectedConfig = {
      ALLOWED_METHODS: 'GET,POST,DELETE',
      AIRTABLE_API_KEY: 'YourApiKey',
      AIRTABLE_BASE_ID: 'YourBaseId',
      AIRTABLE_HTTP_HEADERS: defaultConfig.AIRTABLE_HTTP_HEADERS,
      AIRTABLE_HTTP_METHODS: defaultConfig.AIRTABLE_HTTP_METHODS,
      PORT: 3001,
      READ_ONLY: undefined,
      allowedMethods: [ 'GET', 'POST', 'DELETE' ],
      allMethods: [ 'OPTIONS', 'GET', 'POST', 'DELETE' ],
    };

    config = require('./config');

    expect(config).not.toBeNull();
    expect(config).toEqual(expectedConfig);
  });

  it('returns a correct config when readonly is true', () => {
    process.env = {
      AIRTABLE_API_KEY: 'YourApiKey',
      AIRTABLE_BASE_ID: 'YourBaseId',
      READ_ONLY: 'true',
    };
    const expectedConfig = {
      ALLOWED_METHODS: defaultConfig.ALLOWED_METHODS,
      AIRTABLE_API_KEY: 'YourApiKey',
      AIRTABLE_BASE_ID: 'YourBaseId',
      AIRTABLE_HTTP_HEADERS: defaultConfig.AIRTABLE_HTTP_HEADERS,
      AIRTABLE_HTTP_METHODS: defaultConfig.AIRTABLE_HTTP_METHODS,
      PORT: 3000,
      READ_ONLY: 'true',
      allowedMethods: [ 'GET' ],
      allMethods: [ 'OPTIONS', 'GET' ],
    };

    config = require('./config');

    expect(config).not.toBeNull();
    expect(config).toEqual(expectedConfig);
  });
});
