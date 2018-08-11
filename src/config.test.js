describe('config', () => {
  let config;
  let defaultConfig;

  beforeEach(() => {
    process.env = {};
    jest.resetModules();
    defaultConfig = {
      allowedMethods: ['GET','PUT','POST','PATCH','DELETE'],
      airtableApiKey: 'YourApiKey',
      airtableBaseId: 'YourBaseId',
      port: 3000,
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
      allowedMethods: ['GET','POST','DELETE'],
      airtableApiKey: 'YourApiKey',
      airtableBaseId: 'YourBaseId',
      port: 3001,
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
      allowedMethods: ['GET'],
      airtableApiKey: 'YourApiKey',
      airtableBaseId: 'YourBaseId',
      port: 3000,
    };

    config = require('./config');

    expect(config).not.toBeNull();
    expect(config).toEqual(expectedConfig);
  });
});
