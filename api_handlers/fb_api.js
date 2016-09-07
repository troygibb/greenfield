const request = require('request');
const EventSearch = require("facebook-events-by-location-core");
const { handleUndefined } = require('./utils');
const {
  GEONAMES_USERNAME,
  FB_APP_ACCESS_TOKEN: accessToken,
} = require('../config');

module.exports = {};

//Return one week from now in Unix time format
function oneUnixWeek() {
  const now = (new Date()).getTime();
  const oneWeek = now + 1000 * 60 * 60 * 24 * 7;
  const oneWeekInUnix = Math.round(oneWeek / 1000); 
  return oneWeekInUnix;
} 

function formatFbResponse(events, cb) {
  const responseJSON = events.map((event) => {
    return {
      e_title: event.name,
      e_time: event.startTime,
      e_url: `https://www.facebook.com/events/${ event.id }/`,
      e_location: {
        geolocation: [
          handleUndefined(event, 'venue', 'location', 'lon'), 
          handleUndefined(event, 'venue', 'location', 'lat')
        ],
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
  let jsonData = '';

  //The FB events api requires a latitutde and longitude.
  //geonames is a free api that can convert zip codes to lat/lng.
  //Demo: http://api.geonames.org/postalCodeSearchJSON?postalcode=94107&maxRows=10&username=demo
  request.get(`http://api.geonames.org/postalCodeSearchJSON?postalcode=${ zip }&maxRows=10&username=${ GEONAMES_USERNAME }`)
  .on('data', data => jsonData += data)
  .on('end', function() {
    //information on zip codes is delivered in JSON. One zip can refer to
    //several places across the world so we filter by country code to get
    //only the US result. We access only the latitude/longitude.
    const { lat, lng } = JSON.parse(jsonData).postalCodes
      .filter(loc => loc.countryCode === 'US')[0];

    //call the FB search API:
    //https://github.com/tobilg/facebook-events-by-location-core
    const es = new EventSearch({
      lat,
      lng,
      accessToken,
      distance: 24141,  //15 miles in meters
      until: oneUnixWeek(),
    });

    es.search().then(fbEvents => formatFbResponse(fbEvents.events, cb))
    .catch(err => console.error(JSON.stringify(err)));
  })
};