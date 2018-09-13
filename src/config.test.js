const getConfig = require('./config');

describe('getConfig', () => {
  it('throws without airtableApiKey or airtableBaseId', () => {
    expect(() => {
      getConfig({
        airtableApiKey: undefined,
        airtableBaseId: 'YourBaseId',
      });
    }).toThrow(/airtableApiKey must be/i);

    expect(() => {
      getConfig({
        airtableApiKey: 'YourApiKey',
        airtableBaseId: undefined,
      });
    }).toThrow(/airtableBaseId must be/i);

    expect(() => {
      getConfig({
        airtableApiKey: 'YourApiKey',
        airtableBaseId: 'YourBaseId',
      });
    }).not.toThrow();
  });

  it('throws on invalid allowedMethods', () => {
    expect(() => {
      getConfig({
        airtableApiKey: 'YourApiKey',
        airtableBaseId: 'YourBaseId',
        allowedMethods: 'GET,POST',
      });
    }).toThrow(/allowedMethods must be an array/i);
  });
});
