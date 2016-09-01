angular.module('greenfield', [
  'greenfield.services', 
  'greenfield.eventList',
  'greenfield.events',
  'greenfield.auth',
  'ngRoute'
])
.config(function($routeProvider){
  $routeProvider
  .when('/', {
    templateUrl: 'client/events/events.html',
    controller: 'EventsController'
  })
  .when('/meetupEvents', {
    templateUrl: 'client/eventList/eventList.html',
    controller: 'EventListController'
  })
  .when('/signin', {
    templateUrl: 'client/auth/signin.html',
    controller:'AuthController'
  })
})
.controller('MainController', ['$scope', function($scope) {
		
}]);

