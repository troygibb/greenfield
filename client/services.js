angular.module('greenfield.services', [])
.factory('Events', function($http){
  let savedEvents;
  let saveAll = function(zipcode) {
    return $http({
      method: 'GET',
      // url: '/fakedata'
      url: '/meetupEvents?zip=' + zipcode
    }).then(function(resp){
      savedEvents = resp.data;
    });
  };
  let getAll = function() {
    return savedEvents;
  };
  return {
    getAll,
    saveAll,
  }
});

