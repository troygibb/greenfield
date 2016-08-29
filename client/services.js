angular.module('greenfield.services', [])
.factory('Events', function($http){
  let eventsObject = {};
  let eventSourceImages = {'Facebook Events': '/client/assets/F_icon.svg.png', 'MeetUp': '/client/assets/meetupimg.png'};
  let savedEvents;
  eventsObject.saveAll = function(zipcode) {
    return $http({
      method: 'GET',
      url: '/getEvents?zip=' + zipcode
    }).then(function(resp){
      savedEvents = resp.data;
    });
  };
  eventsObject.getAll = function() {
    return savedEvents;
  };
  //For retreiving source images for all of our APIs. 
  eventsObject.getSourceImage = function(sourceName) {
    return eventSourceImages[sourceName];
  };
  return eventsObject;
});

