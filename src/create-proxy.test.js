const createProxy = require('./create-proxy');

describe('createProxy', () => {
  it('creates proxy server with headers', () => {
    const apiKey = 'abc123';

    const result = createProxy(apiKey);

    expect(result.options.headers.Authorization).toEqual(`Bearer ${apiKey}`);
    expect(result.options.headers.Accept).toEqual('application/json');
  });
});
