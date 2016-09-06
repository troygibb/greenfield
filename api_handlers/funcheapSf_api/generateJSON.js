const scrape = require('./scrape');
const fs = require('fs');

//In case directories have not yet been created.
function checkDirectories(path, ) {
	try {
		return fs.statSync(path).isDirectory()
	}
	catch(err) {
		return false; 
	}
};
if (checkDirectories('./datesHTML')) {
	fs.mkdirSync('datesHTML');
}
if (checkDirectories('./datesJSON')) {
	fs.mkdirSync('datesJSON');
}

scrape.writeJSON();