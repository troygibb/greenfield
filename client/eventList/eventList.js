angular.module('greenfield.eventList', [])
.controller('EventListController', ['$scope', 'Events', function($scope,  Events) {
  $scope.allEvents = Events.getAll();
}]);
