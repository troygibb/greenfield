'use strict';
const request = require('request');
const express = require('express');
const url = require('url');
const { API_KEY } = require('./config');
const app = express();
const port = process.env.PORT || 8080;

app.set('port', port);
app.use(express.static(__dirname + '/'));

app.get('/', function(req, res){
  // console.log(MEMBER_ID, SIG_ID)
  console.log('Serving /');
  res.sendFile(__dirname + '/client/index.html');
});

app.get('/meetupEvents?*', function(req, res){
  const requestUrl = url.parse(req.url);
  //FIXME: Substring method for zip won't account for other queries. 
  const zip = requestUrl.query.substring(4);
  console.log('Serving ', req.url);
  console.log(zip);
  getMeetUpEvents(zip, function(JSONresponse){
    res.send(JSONresponse);
    res.end();
  });
});

const ip = "127.0.0.1";
const server = app.listen(app.get('port'));
console.log('Listening on port ', port);

/*
JSON RESPONSE FORMAT
e_title STRING
e_time MILISECONDS/STRING?
e_url STRING
e_geoLocation TUPLE?
e_location STRING
e_description STRING
e_categories ARRAY of STRINGS
e_source STRING
e_sourceImage JPG/PNG?
*/

//For error handling, as JSON response may have undefined properties.
function handleUndefined(...properties) {
  let currentProperty = properties[0];
  for (let i = 1; i < properties.length; i++) {
    if (currentProperty[properties[i]] === undefined) {
      return null; 
    } else {
      currentProperty = currentProperty[properties[i]];
    }
  }
  return currentProperty; 
};

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
function getMeetUpEvents(zip, cb) {
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
