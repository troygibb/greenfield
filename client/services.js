angular.module('greenfield.services', [])
.factory('Events', ['$http', function($http){
  const eventsObject = {};
  const eventSourceImages = {
    'Facebook Events': '/client/assets/F_icon.svg.png', 
    'MeetUp': '/client/assets/meetupimg.png',
    'FunCheapSF': '/client/assets/funcheaplogo_C_only.png',
    'Eventbrite': '/client/assets/eventbrite__icon_svg.png'
  };

  eventsObject.savedEvents;
  
  eventsObject.getCurrentPosition = function (cb) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var coords = {
        lat: position.coords.latitude,
        lon: position.coords.longitude
      }
      return $http({
        method: 'GET',
        url: '/coords/' + coords.lon + '/' + coords.lat
      })
      .then(function(resp){
        cb(resp.data);
      });
    });
  }

  eventsObject.getEvents = function(zipcode) {
    return $http({
      method: 'GET',
      url: '/getEvents?zip=' + zipcode
    })
    .then(function(resp){
      eventsObject.savedEvents = resp.data;
    });
  };

  // eventsObject.getAll = () => savedEvents;

  //For retreiving source images for all of our APIs. 
  eventsObject.getSourceImage = sourceName => eventSourceImages[sourceName];

  return eventsObject;
}])
.factory('Auth', function($http){
  const AuthObject = {};

  AuthObject.signin = user => {
    return $http({
      method: 'POST',
      url: '',
      data: user
    })
    .then(resp => resp);
  };

  AuthObject.signup = user => {
    return $http({
      method: 'POST',
      url: '',
      data: user
    })
    .then(resp => resp);
  };
})
//Factory for organizing events. Use to be in eventList.js, moved so userEvents.js could have access to the methods.
.factory('EventOrganizer', function(){
  const EventOrganizerObject = {};

  EventOrganizerObject.generateTimeSpan = function(eventsArray, numDays) {
    const day = 1000 * 60 * 60 * 24;
    const today = Date.now();
    const dateArray = [today];
    for (let i = 1; i < numDays; i++) {
      dateArray.push(dateArray[i-1] + day);
    };
    return sortEventsByDate(eventsArray, dateArray.map(day => new Date(day)));
  };

  function sortEventsByDate(eventsArray, timespanArray) {
    return timespanArray.map(function(date){
      return {
        date: date,
        events: eventsArray.filter(function(event) {
          return event === undefined ?
            false : compareDates(date, event.e_time);
        })
      }
    });
  };

  function compareDates(parentDate, childDate) {
    childDate = new Date(childDate);
    return parentDate.setHours(0, 0, 0, 0) === childDate.setHours(0, 0, 0, 0);
  };

  return EventOrganizerObject; 
})
//Factory for saving user saved events per eventList.html.
//Now both EventListController and UserController can access this value. 
.factory('EventCache', function(){
  const userEventsObject = {};
  userEventsObject.savedEvents = [];
  return userEventsObject;
});