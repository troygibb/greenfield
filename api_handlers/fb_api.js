const request = require('request');
const utils = require('./utils');
const EventSearch = require("facebook-events-by-location-core");
const {
  GEONAMES_USERNAME,
  FB_APP_ACCESS_TOKEN: accessToken,
} = require('../config');


module.exports = {};

const handleUndefined = utils.handleUndefined;

function formatFbResponse(parsedJSON, cb) {
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

module.exports.getFbEvents = function(zip, cb) {
  //The FB events api requires a latitutde and longitude.
  //geonames is a free api that converts zip codes to lat/lng:
  request.get(`http://api.geonames.org/postalCodeSearchJSON?postalcode=${zip}&maxRows=10&username=${GEONAMES_USERNAME}`)
  .on('data', function(data) {
    const distance = 10000;
    //information on zip codes is delivered in JSON. One zip code can refer to
    //several places across the world so we filter by country code to get
    //only the US result.
    const loc = JSON.parse('' + data).postalCodes
      .filter(loc => loc.countryCode === 'US')[0];
    const {lat, lng} = loc;
    const es = new EventSearch({
      lat,
      lng,
      distance,
      accessToken,
    });

    es.search().then(function (events) {
      console.log('\nFacebook events:\n');
      events.events.forEach(event => console.log(event.name));

      //Format the events here
    }).catch(function (error) {
      console.error('Oops... ', JSON.stringify(error));
    });

    console.log('\nZip code test:\n', loc);
  })
  .on('end', function() {

  });

  // let body = '';
  // request.get(`https://api.meetup.com/2/open_events?key=${MEETUP_API_KEY}&sign=true&photo-host=public&zip=${zip}&page=20`)
  // .on('data', function(data) {
  //   body += data;
  // })
  // .on('end', function() {
  //   formatMeetupResponse(JSON.parse(body), function(JSONresponse) {
  //     cb(JSONresponse);
  //   });
  // });
};