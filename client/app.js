angular.module('greenfield', ['greenfield.services', 'ngRoute'])
.controller('MainController', ['$scope', function($scope) {
	$scope.hello = "Hello world!";	
}]);

