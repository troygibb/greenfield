angular.module('greenfield', [
  'greenfield.services', 
  'greenfield.location',
  'greenfield.events',
  'ngRoute'
])
.config(function($routeProvider){
  $routeProvider
  .when('/', {
    templateUrl: 'client/location/location.html',
    controller: 'LocationController'
  })
  .when('/events', {
    templateUrl: 'client/events/events.html',
    controller: ' '
  })
})
.controller('MainController', ['$scope', function($scope) {
	$scope.hello = "Hello world!";	
}]);

