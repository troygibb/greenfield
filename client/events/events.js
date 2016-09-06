angular.module('greenfield.events', [])
.controller('EventsController', ['$scope', 'Events', '$location', function($scope, Events, $location) {
	//TODO: Use legit Angular/Bootstrap form validation for this step. See: http://blog.yodersolutions.com/bootstrap-form-validation-done-right-in-angularjs/
	$scope.validZip = true;  
  $scope.loading = false; 
  Events.getCurrentPosition(function(zip) {
    $scope.zip = zip;
  })
	//Zipcode validation regex. 	
	$scope.checkZip = function() {
		$scope.validZip = /^\d{5}$/.test($scope.zip);
		return /^\d{5}$/.test($scope.zip);
	};
  $scope.getEvents = function() {
    $scope.loading = true; 
  	//Server crashes if zip input box is empty.
  	if ($scope.checkZip()) {
  		Events.getEvents($scope.zip)
  		  .then(function(events){
          $scope.loading = false; 
  		    $location.path('/getEvents');
  		  })
  		  .catch(function(err){
  		    console.error(err);
  		  });
  	} 
  };
}]);
