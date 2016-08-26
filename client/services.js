angular.module('greenfield.services', [])
.factory('MeetUp', ['$http', function($http) {
  var MeetUpMethods = {};
  

  return MeetUpMethods; 
}])
.factory('Events', function($http){
  var getAll = function(zipcode) {
  console.log('in factory', zipcode)
    return $http({
      method: 'GET',
      url: '/meetupEvents?zip=' + zipcode,
    }).then(function(resp){
      console.log('in response')
      return resp.data;
    });
  };
  return {
    getAll,
  }
})