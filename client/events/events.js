angular.module('greenfield.events', [])
.controller('EventsController', ['$scope', 'Events', '$location', function($scope, Events, $location) {
	//TODO: Use legit Angular/Bootstrap form validation for this step. See: http://blog.yodersolutions.com/bootstrap-form-validation-done-right-in-angularjs/
	$scope.validZip = true;  
	//Zipcode validation regex. 	
	$scope.checkZip = function() {
		$scope.validZip = /^\d{5}$/.test($scope.zip);
		return /^\d{5}$/.test($scope.zip);
	};
  $scope.getEvents = function() {
  	//Server crashes if zip input box is empty.
  	if ($scope.checkZip()) {
  		Events.saveAll($scope.zip)
  		  .then(function(events){
  		    $location.path('/meetupEvents');
  		  })
  		  .catch(function(err){
  		    console.error(err);
  		  });
  	} 
  };
}]);
