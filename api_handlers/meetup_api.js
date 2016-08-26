const request = require('request');
const utils = require('./utils');
const { MEETUP_API_KEY } = require('../config');

var exports = module.exports = {};

const handleUndefined = utils.handleUndefined;

function formatMeetupResponse(parsedJSON, cb) {
  //TODO: Do we want RSVP count?
  const responseJSON = parsedJSON.results.map((event) => {
    return {
      e_title: event.name,
      e_time: event.time,
      e_url: event.event_url,
      e_location: {
        geolocation: [handleUndefined(event, 'venue', 'lon'), handleUndefined(event, 'venue', 'lat')],
        country: handleUndefined(event, 'venue', 'country'),
        city: handleUndefined(event, 'venue', 'city'),
        address: handleUndefined(event, 'venue', 'address_1'),
        venue_name: handleUndefined(event, 'venue', 'name')
      },
      e_description: event.description,
      e_categories: null,
      e_source: 'MeetUp',
      e_sourceImage: null
    };
  });
  cb(responseJSON);
};

//call via route /getMeetupEvents 
//next steps, call via user zip code
  //after that, geo location
exports.getMeetUpEvents = function(zip, cb) {
  //TODO: Need error handling here. 
  //TODO: Need to factor in sig_id (i.e. user id here)
  let body = '';
  request.get(`https://api.meetup.com/2/open_events?key=${API_KEY}&sign=true&photo-host=public&zip=${zip}&page=20`)
  .on('data', function(data) {
    body += data;
  })
  .on('end', function() {
    formatMeetupResponse(JSON.parse(body), function(JSONresponse) {
      cb(JSONresponse);
    });
  });
};
