angular.module('greenfield.events', [])
.controller('EventsController', ['$scope', 'Events', '$location', function($scope, Events, $location) {
  $scope.getEvents = function() {
    Events.saveAll($scope.zip)
      .then(function(events){
        $location.path('/meetupEvents');
      })
      .catch(function(err){
        console.error(err);
      });
  };
}]);
