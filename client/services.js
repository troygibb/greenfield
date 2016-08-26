angular.module('greenfield.services', [])
.factory('Events', function($http){
  var savedEvents;
  var saveAll = function(zipcode) {
    return $http({
      method: 'GET',
      // url: '/fakedata'
      url: '/meetupEvents?zip=' + zipcode
    }).then(function(resp){
      savedEvents = resp.data;
    });
  };
  var getAll = function() {
    return savedEvents;
  }
  return {
    getAll,
    saveAll
  }
});

