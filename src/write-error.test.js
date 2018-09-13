const writeError = require('./write-error');

describe('writeError', () => {
  beforeEach(() => {
    this.res = {
      writeHead: () => {},
      end: () => {},
    };
    this.status = 405;
    this.code = 'Method Not Allowed';
    this.message = 'This API does not allow "DELETE" requests';
  });

  it('ends response with error', () => {
    spyOn(this.res, 'writeHead').and.callThrough();
    spyOn(this.res, 'end').and.callThrough();

    writeError(this.res, this.status, this.code, this.message);

    expect(this.res.writeHead).toHaveBeenCalledTimes(1);
    expect(this.res.writeHead).toHaveBeenCalledWith(this.status, {
      'Content-Type': 'application/json',
    });
    expect(this.res.end).toHaveBeenCalledTimes(1);
    expect(this.res.end).toHaveBeenCalledWith(
      JSON.stringify({ code: this.code, message: this.message })
    );
  });
});
