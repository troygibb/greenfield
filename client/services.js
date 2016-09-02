angular.module('greenfield.services', [])
.factory('Events', function($http){
  const eventsObject = {};
  const eventSourceImages = {
    'Facebook Events': '/client/assets/F_icon.svg.png', 
    'MeetUp': '/client/assets/meetupimg.png',
    'FunCheapSF': '/client/assets/funcheaplogo_C_only.png',
    'Eventbrite': '/client/assets/eventbrite__icon_svg.png'
  };

  let savedEvents;

  eventsObject.getEvents = function(zipcode) {
    return $http({
      method: 'GET',
      url: '/getEvents?zip=' + zipcode
    })
    .then(function(resp){
      savedEvents = resp.data;
    });
  };

  eventsObject.getAll = () => savedEvents;

  //For retreiving source images for all of our APIs. 
  eventsObject.getSourceImage = sourceName => eventSourceImages[sourceName];

  return eventsObject;
})

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