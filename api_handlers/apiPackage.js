/*
JSON RESPONSE FORMAT
e_title STRING
e_time MILISECONDS/STRING?
e_url STRING
e_geoLocation TUPLE?
e_location: {
  geolocation: TUPLE,
  country: STRING,
  city: STRING,
  address: STRING,
  venue_name: STRING
},
e_description STRING
e_categories ARRAY of STRINGS
e_source STRING
e_sourceImage JPG/PNG?
*/

const url = require('url');
const meetup_api = require('./meetup_api');
const fb_api = require('./fb_api.js');
const eventbrite_api = require('./eventbrite_api.js');
const funcheapSF_api = require('./funcheapSf_api/funcheapSF_handler');
const utils = require('./utils');

var exports = module.exports = {};

//TODO: Pass in response object for error handling?
exports.getEvents = function(req, res, cb) {
	const urlObject = url.parse(req.url);
	//FIXME: Substring method for zip won't account for other queries. 
	const zip = urlObject.query.substring(4);

  //Index of all of the api calls to be handled. 
  const apiCalls = [
    meetup_api.getMeetUpEvents,
    fb_api.getFbEvents,
    funcheapSF_api.getSfEvents
    //,eventbrite_api.getEventbriteEvents
  ];

  utils.asyncMap(apiCalls, JSONarray => cb(JSONarray), zip);
}

//For testing newly created APIs. 
exports.testApiCall = function(req, res, cb) {
  meetup_api.getMeetUpEvents(94549, cb);
  //funcheapSF_api.getSfEvents(null, cb);
}
