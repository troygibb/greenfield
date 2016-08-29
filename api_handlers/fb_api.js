const request = require('request');
const utils = require('./utils');
const EventSearch = require("facebook-events-by-location-core");
const {
  GEONAMES_USERNAME,
  FB_APP_ACCESS_TOKEN: accessToken,
} = require('../config');


module.exports = {};

const handleUndefined = utils.handleUndefined;

function formatFbResponse(events, cb) {
  const responseJSON = events.map((event) => {
    return {
      e_title: event.name,
      e_time: event.startTime,
      e_url: `https://www.facebook.com/events/${event.id}/`,
      e_location: {
        geolocation: [handleUndefined(event, 'venue', 'location', 'lon'), handleUndefined(event, 'venue', 'location', 'lat')],
        country: handleUndefined(event, 'venue', 'location', 'country'),
        city: handleUndefined(event, 'venue', 'location', 'city'),
        address: handleUndefined(event, 'venue', 'location', 'street'),
        venue_name: handleUndefined(event, 'venue', 'name'),
      },
      e_description: event.description,
      e_categories: null,
      e_source: 'Facebook Events',
      e_sourceImage: event.coverPicture,
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
      console.log(events.events[0]);
      formatFbResponse(events.events, eventsObj => cb(eventsObj));
    }).catch(error => console.error('Oops... ', JSON.stringify(error)));
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