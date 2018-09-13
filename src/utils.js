exports.isObject = input =>
  Object.prototype.toString.call(input) === '[object Object]';
