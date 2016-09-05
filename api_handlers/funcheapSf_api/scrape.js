var fs = require('fs');
var cheerio = require('cheerio');
var request = require('request');

module.exports = {};

module.exports.writeJSON = function() {
	checkDateDirectory('/datesHTML', function(newFiles){
		downloadHTMLArray(newFiles, JSONify);
	});
};

//DATE FORMATTERS
function generateNextWeek() {
	let today = Date.now();
	let day = 1000 * 60 * 60 * 24;
	let nextWeek = [today];
	for (let i = 1; i < 7; i++) {
		nextWeek.push(nextWeek[i-1] + day);
	}
	return nextWeek.map(function(date){
		let day = new Date(date);
		return [
			day.getMonth() + 1,
			day.getDate(),
			day.getFullYear()
		];
	});
};

function compareDates(cachedDates) {
	let toBeScraped = [];
	let nextWeek = generateNextWeek();
	let splittedCache = cachedDates.map(function(date) {
		let dateArr = date.split('.');
		//To get rid of .txt/.json formatting. 
		dateArr.pop();
		return dateArr; 
	});
	for (let i = 0; i < nextWeek.length; i++) {
		let curr = nextWeek[i];
		let searchArray = splittedCache.slice();
		for (let j = 0; j < 3; j++) {
			searchArray = searchArray.filter(function(date) {
				let newNum = parseInt(date[j]);
				//Compare numbers, each in turn. 
				//FIXME: Currently discrepancy between year length 'YY' vs. 'YYYY'
				return newNum === curr[j];
			});
		}
		if (!searchArray.length) {
			toBeScraped.push(curr);
		}
	}
	return toBeScraped;
};

//For formatting funCheapSF date. TODO: Better way to do this. 
function formatDate(dateArr) {
	return dateArr.map(function(val) {
		val = val.toString();
		if (val.length < 2) {
			return '0' + val; 
		} else if (val.length === 4) {
			return val.toString().substring(2);
		} else {
			return val; 
		}
	});
};

function checkDateDirectory(directoryPath, callback) {
	fs.readdir(__dirname + directoryPath, function(err, data){
		let datesToBeScraped = compareDates(data);
		callback(datesToBeScraped);
	});
};

//FORMATTING TIME
//Formatting am/pm into miliseconds (e.g. 8:00pm into 72000000)
function formatTimeFromAmPm(timeString) {
	const halfDay = 1000 * 60 * 60 * 12;
	const hour = 1000 * 60 * 60;
	const minute = 1000 * 60;
	const extraTime = /am/gi.test(timeString) ? 0 : halfDay;
	const timeArr = timeString.split(':').map(val => parseInt(val.replace(/\D/g, '')));
	return timeArr[0] * hour + timeArr[1] * minute + extraTime;
};

function mergeTime(dateArr, amPm) {
	const date = new Date(dateArr);
	return new Date(date.getTime() + formatTimeFromAmPm(amPm));
}
//END OF FORMATTING TIME
 
function JSONify() {
	checkDateDirectory('/datesJSON', function(datesToJSONify) {
		datesToJSONify.forEach(function(date){
			var newDate = formatDate(date).join('.');
			console.log('Initiating parse for date ', newDate);
			parseHTML(__dirname + `/datesHTML/${newDate}.txt`, __dirname + `/datesJSON/${newDate}.txt`);
		});
	});
};

function parseCategories(classString) {
	return classString.split(' ')
	.filter(function(htmlClass) {
		return /^category\-*/.test(htmlClass);
	})
	.map(function(category) {
		var category = category.split('-')
		category.shift();
		return category.join(' ')
	});
};

//JSON FORMATTING
function parseHTML(sourcePath, destPath) {
	//To snag current date for JSON response object. 
	let currDate = sourcePath.substring(sourcePath.length - 12).split('.');
	currDate.pop();
	console.log('parsing ', sourcePath, destPath);
	fs.readFile(sourcePath, (err, data) => {
		if (err) throw err; 
		var $ = cheerio.load(data);
		var resultArr = [];
		var result = $('.archive')
		.find('article')
		.find('.entry-header')
		.each(function(i, el) {
			//TODO: Shorten prop handlers below. 
			var obj = {
				e_title: $(this).find('.entry-title').text(),
				e_time: mergeTime(currDate, $(this).find('.entry-meta').find('.date-time').text().split('to')[0]), 
				e_endTime: $(this).find('.entry-meta').find('.date-time').text().split('to')[1],
				e_url: $(this).find('.entry-title').find('a').attr('href'),
				e_location: {
				  geolocation: null,
				  country: null,
				  city: $(this).find('.entry-meta').find('.region').find('.region-parent').text(),
				  address: null,
				  venue_name: null,
				  area: $(this).find('.entry-meta').find('.region').find('.region-child').text()
				},
				e_description: null,
				e_categories: parseCategories($(this).parent().attr('class')),
				e_source: 'FunCheapSF',
				e_sourceImage: null,
				cost: $(this).find('.entry-meta').find('.cost').text(),
				postId: $(this).parent().attr('id'),
				date: currDate
			};
			resultArr.push(obj);
		});
		var json = JSON.stringify(resultArr);
		//TODO: Separate into separate function. 
		fs.writeFile(destPath, json, function(err){
				if (err) throw err;
				console.log('Saved JSON!');
		});
	});
};

//HTML FUNCTIONS
function downloadHTMLArray(files, cb) {
	let copy = files.slice();
	if (!copy.length) {
		cb();
		return; 
	}
	downloadHTML(copy[0], function() {
		copy.shift();
		downloadHTMLArray(copy, cb);
	})
};

//Date is in [mm, dd, yy]
function downloadHTML(date, callback) {
	let formatted = formatDate(date);
	//TODO: Fix the monstrocity below for correct date formatting. 
	let sfDate = [].concat('20' + formatted[2], formatted[0], formatted[1]).join('/');
	let dirDate = formatDate(date).join('.');
	const url = `http://sf.funcheap.com/${sfDate}/`;
	console.log('requesting url ', url);
	request(url, function(error, response, html){
		if(!error) {
			var $ = cheerio.load(html);
			var data = $.html();
			fs.writeFile(`${__dirname}/datesHTML/${dirDate}.txt`, data, function(err){
		 		if (err) throw err;
		 		console.log('Saved HTML!');
		 		callback();
		  });
		}
	});
};
