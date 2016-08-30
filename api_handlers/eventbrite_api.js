const request = require('request');
const utils = require('./utils');
const { EVENTBRITE_API_KEY} = require('../config')

// The code is hard to read but I will try to refactor later. 
///////////////////////////////////////////////////////////////////////////
// What the TestApiCall needs to look like. 
///////////////////////////////////////////////////////////////////////////
// exports.testApiCall = function(req, res, cb) {
//   const urlObject = url.parse(req.url);
//   const regexMatch = /[^=]+$/;
//   const address = urlObject.query.match(regexMatch)[0];
//   eventbrite_api.getEventbriteEvents(address, cb);
// }

var exports = module.exports = {};
const handleUndefined = utils.handleUndefined;

const dataFilter = (parsedJSON) => {
  const eventsObj = parsedJSON.events.map((event) => {
    return {
        e_title: event.name.text,
        e_time: event.start, // time in timestamp format??
        e_url: event.vanity_url || event.url,
        e_venue_id: event.venue_id, //getting venue_id to make another get request later. 
        e_description: event.description.text,
        e_categories: null,
        e_source: 'Eventbrite',
        e_sourceImage: event.logo
    }
  });

  const venueArr = parsedJSON.events.map((event) => {
    return {
      "method": "GET", 
      "relative_url": "venues/" + event.venue_id
    }
  }); //Making an array to send as a param in body in POST request for a batch. This is the only way I could get the API request for all the venue addresses.

  return {
    eventsObj,
    venueArr
  };
};

const getEventbriteAddr = (venueArr, filteredData, cb) => { 
  let body = '';
  let urlPath = `https://www.eventbriteapi.com/v3/batch/?token=${EVENTBRITE_API_KEY}`;

  request.post(
    urlPath)
  .form({
      batch: JSON.stringify(venueArr)
  })
  .on('data', (data) => {
    body += data;
  })
  .on('end', () => {
    cb(JSON.parse(body), filteredData);
  }).on('error', (error) => {
    console.log(error);
  });
} //batch post request for addresses

exports.getEventbriteEvents = (address, cb) => {
  let body = '';
  const urlPath = `https://www.eventbriteapi.com/v3/events/search/?location.address=${address}&token=${EVENTBRITE_API_KEY}`;

  request.get(urlPath) //getting the events here
  .on('data', (data) => {
    body += data;
  })
  .on('end', () => {
    const address = dataFilter(JSON.parse(body)).venueArr;
    const filteredData = dataFilter(JSON.parse(body)).eventsObj;

    getEventbriteAddr(address, filteredData, (address, filteredData) => { //I'll try to refactor
      filteredData.forEach((eventObj, idx) => { //For the address received, need to combine with the array of events. This is where this gets done.
        let currAddr = JSON.parse(address[idx].body);
        if (eventObj.e_venue_id===currAddr.id) {
          eventObj.e_location = {
            geolocation: [handleUndefined(currAddr, 'address', 'longitude'), handleUndefined(currAddr, 'address', 'latitude')],
            country: handleUndefined(currAddr, 'address', 'country'),
            city: handleUndefined(currAddr, 'address', 'city'),
            address: handleUndefined(currAddr, 'address', 'address_1'),
            venue_name: handleUndefined(address[idx], 'body', 'name')
          }
        }
      })
      cb(filteredData);
    });
  });
}