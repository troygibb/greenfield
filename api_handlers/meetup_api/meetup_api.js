const request = require('request');
const utils = require('../utils');
const cacheUtils = require('../cacheUtils');
const { MEETUP_API_KEY } = require('../../config');
const checkTimeRange = cacheUtils.checkTimeRange;
module.exports = {};

/*
GET /2/open_events 

Searches for recent and upcoming public events hosted by Meetup groups. Its search window is the past one month through the next three months, and is subject to change. Open Events is optimized to search for current events by location, category, topic, or text, and only lists Meetups that have 3 or more RSVPs. The number or results returned with each request is not guaranteed to be the same as the page size due to secondary filtering. 

*/

const handleUndefined = utils.handleUndefined;
const formatCategories = utils.formatCategories;

function formatMeetupResponse(parsedJSON, cb) {
  //TODO: Do we want RSVP count?
  const responseJSON = parsedJSON.results.map((event) => {
    return {
      e_title: event.name,
      e_time: formatDate(event.time),
      e_url: event.event_url,
      e_location: {
        geolocation: [handleUndefined(event, 'venue', 'lon'), handleUndefined(event, 'venue', 'lat')],
        country: handleUndefined(event, 'venue', 'country'),
        city: handleUndefined(event, 'venue', 'city'),
        address: handleUndefined(event, 'venue', 'address_1'),
        venue_name: handleUndefined(event, 'venue', 'name')
      },
      e_description: null,
      e_categories: null,
      e_source: 'MeetUp',
      e_sourceImage: event.photo_url,
      e_cost: handleUndefined(event, 'fee', 'amount'),
      yes_rsvp_count: event.yes_rsvp_count,
      maybe_rsvp_count: event.maybe_rsvp_count,
      groupUrlName: handleUndefined(event, 'group', 'urlname')
    };
  });
  findGroupCategories(responseJSON, function(){
     cb(responseJSON);
  });
};

function formatDate(time) {
  return new Date(time)
}

function findGroupCategories(jsonArray, cb) {
  let copy = jsonArray.slice();
  if (!copy.length) {
    cb()
    return; 
  }
  let currentGroup = jsonArray[0];
  copy.shift();
  let body = '';
  request.get(`https://api.meetup.com/${currentGroup.groupUrlName}?key=${MEETUP_API_KEY}&only=category.name,group_photo.thumb_link`)
  .on('data', function(data){
    body += data; 
  })
  .on('end', function() {
    currentGroup.e_categories = formatCategories([handleUndefined(JSON.parse(body), 'category', 'name')]); 
    currentGroup.e_sourceImage = currentGroup.e_sourceImage || handleUndefined(JSON.parse(body), 'group_photo', 'thumb_link');
    findGroupCategories(copy, cb);
  });
};

//call via route /getMeetupEvents 
//next steps, call via user zip code
  //after that, geo location
module.exports.getMeetUpEvents = function(zip, cb) {
  //TODO: Need error handling here. 
  //TODO: Need to factor in sig_id (i.e. user id here)
  const result = [];
  let body = '';
  request.get(`https://api.meetup.com/2/open_events?key=${MEETUP_API_KEY}&sign=true&photo-host=public&zip=${zip}&page=200&radius=5&omit=description&only=name,time,event_url,venue.lon,venue.lat,venue.country,venue.address_1,venue.name,photo_url,fee.amount,yes_rsvp_count,maybe_rsvp_count,group.urlname`)
  .on('data', function(data) {
    body += data;
  })
  .on('end', function() {
    formatMeetupResponse(JSON.parse(body), function(JSONresponse) {
      cb(JSONresponse);
    });
  });
};
