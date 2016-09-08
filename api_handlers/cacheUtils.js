const fs = require('fs');
const moment = require('moment');

var exports = module.exports = {};

//In case directories have not yet been created.
exports.checkDirectory = function(path) {
	try {
		return fs.statSync(path).isDirectory()
	}
	catch(err) {
		return false; 
	}
};

//For checking to see if the resulting data is beyond 7 days. 
exports.checkTimeRange = function(date, numDays) {
	const endDate = moment().add(numDays, 'days');
	return moment(date).isBefore(endDate);
};