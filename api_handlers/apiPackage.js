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
const meetup_api = require('./meetup_api/meetup_cache');
const fb_api = require('./fb_api');
const eventbrite_api = require('./eventbrite_api');
const funcheapSF_api = require('./funcheapSf_api/funcheapSF_handler');
const seatgeek_api = require('./seatgeek_api');
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
    seatgeek_api.getSeatGeekEvents,
    fb_api.getFbEvents,
    //eventbrite_api.getEventbriteEvents
  ];

  const SFzips = [
    94102, 94103, 94104, 94105, 94107,
    94108, 94109, 94110, 94111, 94112,
    94114, 94115, 94116, 94117, 94118,
    94121, 94122, 94123, 94124, 94127,
    94129, 94130, 94131, 94132, 94133,
    94134, 94158
  ];

  if(SFzips.indexOf(parseInt(zip)) > -1) {
    apiCalls.push(funcheapSF_api.getSfEvents);
  }

  utils.asyncMap(apiCalls, cb, zip);
}

//For testing newly created APIs. 
exports.testApiCall = function(req, res, cb) {
  // seatgeek_api.getSeatGeekEvents(94549, data => 
  //   res.send(JSON.stringify(data))
  // );
  meetup_api.getMeetUpEvents(94105, data => 
    res.send(JSON.stringify(data))
  );
  //funcheapSF_api.getSfEvents(null, cb);
}
