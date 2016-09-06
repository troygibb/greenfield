const request = require('request');
const utils = require('./utils');
const { SEATGEEK_CLIENT_ID } = require('../config');
const moment = require('moment');
const handleUndefined = utils.handleUndefined;
module.exports = {};

//API a score feature that could be interesting to integrate...
//TODO: Figure out how to get cost. 
function formatSeatGeekResponse(parsedJSON) {
	return parsedJSON.events.map(event => {
		return {
			e_title: event.title,
			e_time: event.datetime_local,
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
			e_categories: event.taxonomies.map(nom => nom.name),
			e_source: 'SeatGeek',
			e_sourceImage: handleUndefined(event, 'performers', 'image'),
			e_cost: null
		};
	})
};

module.exports.getSeatGeekEvents = (zip, cb) => {
	const startDate = moment().format('YYYY-MM-DD');
	const endDate = moment().add(7, 'days').format('YYYY-MM-DD');
	let data = '';
	request.get(`https://api.seatgeek.com/2/events?datetime_utc.gte=${startDate}&datetime_utc.lte=${endDate}&geoip=${zip}&client_id=${SEATGEEK_CLIENT_ID}`)
	.on('data', newData => {
		data += newData;
	})
	.on('end', () => {
		cb(formatSeatGeekResponse(JSON.parse(data)));
	});
};