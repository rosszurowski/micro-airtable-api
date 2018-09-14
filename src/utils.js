exports.isObject = input =>
  Object.prototype.toString.call(input) === '[object Object]';

exports.compact = arr => arr.filter(Boolean);
