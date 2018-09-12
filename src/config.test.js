const getConfig = require('./config');

describe('getConfig', () => {
  it('throws without airtableApiKey or airtableBaseId', () => {
    expect(() => {
      getConfig({
        airtableApiKey: undefined,
        airtableBaseId: 'hello',
      });
    }).toThrow(TypeError);

    expect(() => {
      getConfig({
        airtableApiKey: 'hello',
        airtableBaseId: undefined,
      });
    }).toThrow(TypeError);

    expect(() => {
      getConfig({
        airtableApiKey: 'hello',
        airtableBaseId: 'world',
      });
    }).not.toThrow(TypeError);
  });
});
