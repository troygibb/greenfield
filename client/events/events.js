angular.module('greenfield.events', [])
.controller('EventsController', ['$scope', 'Events', '$location', function($scope, Events, $location) {
	//TODO: Use legit Angular/Bootstrap form validation for this step. See: http://blog.yodersolutions.com/bootstrap-form-validation-done-right-in-angularjs/
	$scope.validZip = true;  
  $scope.loading = false; 
  Events.getCurrentPosition(zip => $scope.currentLocationZip = zip);

	//Zipcode validation regex. 	
	$scope.checkZip = zip => /^\d{5}$/.test(zip);

  $scope.getEvents = function(zip) {
    $scope.loading = true; 
  	//Server crashes if zip input box is empty.
  	if ($scope.checkZip(zip)) {
  		Events.getEvents(zip)
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
