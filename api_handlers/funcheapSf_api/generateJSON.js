const scrape = require('./scrape');
const fs = require('fs');
const cacheUtils = require('../cacheUtils');
const checkDirectory = cacheUtils.checkDirectory;

if (!checkDirectory('./datesHTML')) {
	fs.mkdirSync('./datesHTML');
}
if (!checkDirectory('./datesJSON')) {
	fs.mkdirSync('./datesJSON');
}

if (checkDirectory('./datesHTML') && checkDirectory('./datesJSON')) {
	scrape.writeJSON();
} else {
	console.log('Error: No datesHTML or datesJSON directories');
}