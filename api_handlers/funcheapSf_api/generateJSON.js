const scrape = require('./scrape');
const fs = require('fs');
const cacheUtils = require('../cacheUtils');
const checkDirectory = cacheUtils.checkDirectory;

//In case directories have not yet been created.
function checkDirectories(path) {
	try {
		return fs.statSync(path).isDirectory()
	}
	catch(err) {
		return false; 
	}
};
if (!checkDirectories('./datesHTML')) {
	fs.mkdirSync('datesHTML');
}
if (!checkDirectories('./datesJSON')) {
	fs.mkdirSync('datesJSON');
}

if (checkDirectory('./datesHTML') && checkDirectory('./datesJSON')) {
	scrape.writeJSON();
} else {
	console.log('Error: No datesHTML or datesJSON directories');
}
