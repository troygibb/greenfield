angular.module('greenfield.eventList', [])
.controller('EventListController', ['$scope', 'Events', function($scope,  Events) {
 //$scope.img = `assets/meetup-128.png`
  $scope.allEvents = Events.getAll();
  $scope.getSourceImage = function(sourceName) {
  	return Events.getSourceImage(sourceName);
  }
  $scope.dance = function(){
  	console.log($scope.allEvents);
  };
  $scope.dance();
}]);
