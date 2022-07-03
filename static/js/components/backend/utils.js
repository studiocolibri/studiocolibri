exports.deepClone = function deepClone(variable) {
  if (typeof variable !== "object") {
    return variable;
  }

  var clone;
  if (Array.isArray(variable)) {
    clone = [];
  } else {
    clone = {};
  }

  for (var key in variable) {
    clone[key] = deepClone(variable[key])
  }

  return clone;
};