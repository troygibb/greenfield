const request = require('request');
const utils = require('./utils');
const { SEATGEEK_CLIENT_ID } = require('../config');
const moment = require('moment');
const handleUndefined = utils.handleUndefined;
const formatCategories = utils.formatCategories;
module.exports = {};

//API a score feature that could be interesting to integrate...
//TODO: Figure out how to get cost. 
function formatSeatGeekResponse(parsedJSON) {
	return parsedJSON.events.map(event => {
		return {
			e_title: event.title,
			e_time: (event.datetime_utc),
			e_endTime: null,
			e_url: event.url,
			e_location: {
				geolocation: [handleUndefined(event, 'venue', 'location', 'lon'), handleUndefined(event, 'venue', 'location', 'lat')],
				country: handleUndefined(event, 'country'),
				city: handleUndefined(event, 'city'),
				address: handleUndefined(event, 'venue', 'address'),
				venue_name: handleUndefined(event, 'venue', 'name'),
				area: null
			},
			e_description: null,
			e_categories: formatCategories(event.taxonomies.map(nom => nom.name)),
			e_source: 'SeatGeek',
			e_sourceImage: handleUndefined(event, 'performers')[0].image,
			e_cost: null
		};
	})
};

//For checking to see if the resulting data is beyond 7 days. 
function checkTimeRange(date) {
	const endDate = moment().add(7, 'days');
	return moment(date).isBefore(endDate);
};

//https://api.seatgeek.com/2/events/?datetime_utc.gte=2016-09-05&geoip=94105&page=10&sort=datetime_utc.asc&client_id=NTYwNzczMXwxNDczMDk5NTIz
module.exports.getSeatGeekEvents = (zip, cb) => {
	const startDate = moment().format('YYYY-MM-DD');
	const result = [];
	function subRoutine(pageNum, cb) {
		if (result.length && !checkTimeRange(result[result.length -1].e_time)) {
			cb(result);
			return; 
		}
		let data = '';
		request.get(`https://api.seatgeek.com/2/events?page=${pageNum}&datetime_utc.gte=${startDate}&sort=datetime_utc.asc&geoip=${zip}&client_id=${SEATGEEK_CLIENT_ID}`)
		.on('data', newData => {
			data += newData;
		})
		.on('end', () => {
			result.push(...formatSeatGeekResponse(JSON.parse(data)));
			subRoutine(pageNum + 1, cb);
		});
	}
	subRoutine(1, cb);
};