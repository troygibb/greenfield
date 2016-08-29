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

//For handling multiple asynchronous calls. 
exports.asyncMap = function(asyncTasks, callback, ...args) {
	let result = [];
	let taskCount = 0; 
	for (let i = 0; i < asyncTasks.length; i++) {
		(function(i){
			asyncTasks[i](...args, function(value){
				taskCount++;
				result[i] = value;
				if (taskCount === asyncTasks.length){
					callback(result);
				}
			});
		})(i);
	}
};

//For flattening resulting JSON objects out of asyncMap. 
exports.flatten = function(array) {
	let result = [];
	array.forEach(function(JSONarray){
		JSONarray.forEach(function(JSONobject){
			result.push(JSONobject);
		})
	});
	return result; 
};