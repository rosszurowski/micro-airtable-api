const getConfig = require("./config");

describe("config", () => {
  const defaultConfig = {
    allowedMethods: ["GET", "PUT", "POST", "PATCH", "DELETE"],
    airtableApiKey: "YourApiKey",
    airtableBaseId: "YourBaseId",
    port: 3000
  };

  it("returns the default config when only API Key and Base ID are set", () => {
    const config = getConfig({
      AIRTABLE_API_KEY: "YourApiKey",
      AIRTABLE_BASE_ID: "YourBaseId"
    });

    expect(config).not.toBeNull();
    expect(config).toEqual(defaultConfig);
  });

  it("throws an error when no env variables set", () => {
    expect(() => {
      getConfig({});
    }).toThrow(/Please provide AIRTABLE_BASE_ID and AIRTABLE_API_KEY/i);
  });

  it("returns the correct config when env variables are set", () => {
    const expectedConfig = {
      allowedMethods: ["GET", "POST", "DELETE"],
      airtableApiKey: "YourApiKey",
      airtableBaseId: "YourBaseId",
      port: 3001
    };

    const config = getConfig({
      ALLOWED_METHODS: "GET,POST,DELETE",
      AIRTABLE_API_KEY: "YourApiKey",
      AIRTABLE_BASE_ID: "YourBaseId",
      PORT: 3001
    });

    expect(config).not.toBeNull();
    expect(config).toEqual(expectedConfig);
  });

  it("returns a correct config when readonly is true", () => {
    const expectedConfig = {
      allowedMethods: ["GET"],
      airtableApiKey: "YourApiKey",
      airtableBaseId: "YourBaseId",
      port: 3000
    };

    const config = getConfig({
      AIRTABLE_API_KEY: "YourApiKey",
      AIRTABLE_BASE_ID: "YourBaseId",
      READ_ONLY: "true"
    });

    expect(config).not.toBeNull();
    expect(config).toEqual(expectedConfig);
  });
});
