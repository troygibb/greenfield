angular.module('greenfield.events', [])
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