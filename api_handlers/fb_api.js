const request = require('request');
const utils = require('./utils');
const EventSearch = require("facebook-events-by-location-core");
const {
  GEONAMES_USERNAME,
  FB_APP_ACCESS_TOKEN: accessToken,
} = require('../config');

module.exports = {};

const handleUndefined = utils.handleUndefined;

//from http://dejanstojanovic.net/jquery-javascript/2015/september/parsing-date-from-facebook-opengraph-api-response-with-javasscript/
function parseDateString(dateStr) {  
    const dateDate = dateStr.split("T")[0];  
    const dateTime = dateStr.split("T")[1].substring(0, 8);  
    const dateResult = new Date(Date.UTC(  
        dateDate.split("-")[0], /* Year */  
        dateDate.split("-")[1], /* Month */  
        dateDate.split("-")[2], /* Day */  
        dateTime.split(":")[0], /* Hour */  
        dateTime.split(":")[1], /* Minute */  
        dateTime.split(":")[2]  /* Second*/  
    ));  
    return dateResult;  
} 

function formatFbResponse(events, cb) {
  //filter out events farther away than 1 week
  const responseJSON = events.filter(event => {
    const e_date = parseDateString(event.startTime);
    const today = new Date();
    const oneWeek = 1000 * 60 * 60 * 24 * 7;
    return e_date.getTime() - today.getTime() < oneWeek;
  })
  .map((event) => {
    return {
      e_title: event.name,
      e_time: event.startTime,
      e_url: `https://www.facebook.com/events/${event.id}/`,
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
  //The FB events api requires a latitutde and longitude.
  //http://www.geonames.org/ is a free api that 
  //converts zip codes to lat/lng:
  request.get(`http://api.geonames.org/postalCodeSearchJSON?postalcode=${zip}&maxRows=10&username=${GEONAMES_USERNAME}`)
  .on('data', function(data) {
    //distance in meters
    const distance = 20000;

    //information on zip codes is delivered in JSON. One zip code can refer to
    //several places across the world so we filter by country code to get
    //only the US result. We access only the latitude/longitude.
    const {lat, lng} = JSON.parse('' + data).postalCodes
      .filter(loc => loc.countryCode === 'US')[0];

    //call the API: https://github.com/tobilg/facebook-events-by-location-core
    const es = new EventSearch({
      lat,
      lng,
      distance,
      accessToken,
    });

    es.search().then(function (events) {
      formatFbResponse(events.events, eventsObj => cb(eventsObj));
    }).catch(err => console.error('Oops... ', JSON.stringify(err)));
  })
  .on('end', function() {

  });
};