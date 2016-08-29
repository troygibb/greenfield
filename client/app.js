angular.module('greenfield', [
  'greenfield.services', 
  'greenfield.eventList',
  'greenfield.events',
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
})
.controller('MainController', ['$scope', function($scope) {
		
}]);

