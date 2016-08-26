var exports = module.exports = {};

//For error handling, as JSON response may have undefined properties.
exports.handleUndefined = function(...properties) {
  let currentProperty = properties[0];
  for (let i = 1; i < properties.length; i++) {
    if (currentProperty[properties[i]] === undefined) {
      return null; 
    } else {
      currentProperty = currentProperty[properties[i]];
    }
  }
  return currentProperty; 
};