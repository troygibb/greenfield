angular.module('greenfield.events', [])
<<<<<<< HEAD
.controller('EventsController', ['$scope', 'Events', function($scope, Events) {
  $scope.data;
  $scope.getEvents = function() {
    console.log($scope.zip)
    Events.getAll($scope.zip)
      .then(function(events){
    console.log('in controller', events)

        $scope.data = events;
      })
      .catch(function(err){
        console.error(err);
      });

  };
}])
=======
.controller('EventsController', ['$scope', '$http', function($scope, $http) {
  $scope.getEvents = function(zip) {
    $http({
        method: 'GET',
        url: '/meetupEvents?zip=' + zip
      })
      .then(function (resp) {
        return resp.data;
      })
      .then(function(data) {
        $scope.usersView = data;
      })
      .then(function (resp) {
        console.log(resp, "THIS DA RESPONSE")
      });
  }
}])

// .factory('Events', function($http, $location) {
//   var getAll = function(zipcode) {
//     return $http({
//       method: 'GET',
//       url: '/meetupEvents?zip=' + zipcode,
//     })
//     .then(function(resp) {
//       return resp.data;
//     })
//   }
//   return {
//     getAll: getAll,
//   }
// })
>>>>>>> (feat) Add data request functionality on button submit
