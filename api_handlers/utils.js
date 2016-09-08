var exports = module.exports = {};

const NodeGeocoder = require('node-geocoder');
const { MAPQUEST_API_KEY } = require('../config');

const shallowFlatten = arr => [].concat(...arr);

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

//For handling multiple asynchronous calls. 
exports.asyncMap = function(asyncTasks, callback, ...args) {
  const result = [];
  let taskCount = 0; 
  for (let i = 0; i < asyncTasks.length; i++) {
    const index = i;
    asyncTasks[index](...args, function(value){
      taskCount++;
      result[index] = value;
      if (taskCount === asyncTasks.length){
        callback(shallowFlatten(result));
      }
    });
  }
};

exports.formatCategories = function(categoryArray) {
  return categoryArray
  .filter(category => category)
  .map(category => {
    return category
    .replace(/^(\w)/, p1 => p1.toUpperCase())
    .replace(/(\_)/g, ' ');
  })
};

const options = {
  provider: 'mapquest',
  httpAdapter: 'https', // Default 
  apiKey: MAPQUEST_API_KEY, 
  formatter: null,
};

exports.geocoder = NodeGeocoder(options);