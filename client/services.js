angular.module('greenfield.services', [])
.factory('Events', function($http){
  let eventsObject = {};
  const eventSourceImages = {
    'Facebook Events': '/client/assets/F_icon.svg.png', 
    'MeetUp': '/client/assets/meetupimg.png',
    'FunCheapSF': '/client/assets/funcheaplogo_C_only.png',
    'Eventbrite': '/client/assets/eventbrite__icon_svg.png'
  };
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
})
.factory('Login', function($http){
  
})

