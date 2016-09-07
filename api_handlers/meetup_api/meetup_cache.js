const fs = require('fs');
const meetup_api = require('./meetup_api');
const cacheUtils = require('../cacheUtils');
const moment = require('moment');
const checkDirectory = cacheUtils.checkDirectory;

var exports = module.exports = {};

exports.getMeetUpEvents = function(zip, cb) {
	if (!checkDirectory(__dirname + '/meetupJSON')) {
		fs.mkdirSync(__dirname + '/meetupJSON');
	}
	checkZipCache(zip, inCache => {
		if (inCache) {
			console.log("Loading up cache!");
			fs.readFile(__dirname + `/meetupJSON/${zip}`, (err, data) => {
				if (err) throw err;
				cb(JSON.parse(data));
			})
		} else {
			meetup_api.getMeetUpEvents(zip, parsedJSON => {
				fs.writeFile(__dirname + `/meetupJSON/${zip}`, JSON.stringify(parsedJSON), err => {
					if (err) throw err;
					console.log('Saved Meetup Events for ', zip);
					cb(parsedJSON);
				})
			})
		}
	});
};

function checkZipCache(zip, cb) {
	fs.readdir(__dirname + '/meetupJSON', (err, files) => {
		if (err) throw err;
		cb(files.indexOf(zip) > -1);
	});
};