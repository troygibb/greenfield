angular.module('greenfield.services', [])
.factory('Events', function($http){
  let eventsObject = {};
  let savedEvents;

  const eventSourceImages = {
    'Facebook Events': '/client/assets/F_icon.svg.png', 
    'MeetUp': '/client/assets/meetupimg.png',
    'FunCheapSF': '/client/assets/funcheaplogo_C_only.png',
    'Eventbrite': '/client/assets/eventbrite__icon_svg.png'
  };
<<<<<<< 3145775d00a47deec3716231d147ae697e0f841a
  let savedEvents;
  eventsObject.getEvents = function(zipcode) {
=======

  eventsObject.saveAll = function(zipcode) {
>>>>>>> (feat) Adding time/distance selection functionality
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
  let AuthObject = {};
  AuthObject.signin = user => {
    return $http({
      method: 'POST',
      url: '',
      data: user
    })
    .then(resp => {
      return resp;
    });
  };
  AuthObject.signup = user => {
    return $http({
      method: 'POST',
      url: '',
      data: user
    })
    .then(resp => {
      return resp;
    });
  };
})

