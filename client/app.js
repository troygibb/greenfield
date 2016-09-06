angular.module('greenfield', [
  'greenfield.services', 
  'greenfield.eventList',
  'greenfield.events',
  'greenfield.auth',
  'greenfield.userEvents',
  'greenfield.directives',
  'ngRoute'
])
.config(function($routeProvider){
  $routeProvider
  .when('/', {
    templateUrl: 'client/events/events.html',
    controller: 'EventsController'
  })
  .when('/getEvents', {
    templateUrl: 'client/eventList/eventList.html',
    controller: 'EventListController'
  })
  .when('/signin', {
    templateUrl: 'client/auth/signin.html',
    controller:'AuthController'
  })
  .when('/userEvents', {
    templateUrl: 'client/userEvents/userEvents.html',
    controller: 'UserEventsController'
  })
})
.controller('MainController', ['$scope', 'Events', '$location', function($scope, Events, $location) {
    Events.getCurrentPosition(function(zip) {
      $scope.zip = zip;
    })
    $scope.validZip = true;  
    $scope.loading = false; 
    $scope.checkZip = function() {
      $scope.validZip = /^\d{5}$/.test($scope.zip);
      return /^\d{5}$/.test($scope.zip);
    };
    $scope.getEvents = function() {
      $scope.loading = true; 
      if ($scope.checkZip()) {
        Events.getEvents($scope.zip)
          .then(function(events){
            $scope.loading = false; 
            $location.path('/getEvents');
          })
          .catch(function(err){
            console.error(err);
          });
      } 
    };

}]);


