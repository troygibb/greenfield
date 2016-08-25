angular.module('greenfield', ['greenfield.services', 'ngRoute'])
.controller('MainController', ['$scope', 'MeetUp', function($scope, MeetUp) {
	$scope.hello = "Hello world!";
	$scope.getEvents = function() {
		MeetUp.getEvents(function(results) {
			console.log(results);
		})
	};
	$scope.getEvents();
}])
.config(
  [
      "rmConsumerProvider",
      function(rmConsumerProvider) {
          rmConsumerProvider.setKey('pm9mcf5jng44n5s2g54r1650cp');
          rmConsumerProvider.setRedirectURI('http://localhost:8080');
      }
  ]
);

