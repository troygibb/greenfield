angular.module('greenfield.eventList', [])
.controller('EventListController', ['$scope', 'Events', function($scope,  Events) {
 //$scope.img = `assets/meetup-128.png`
  $scope.allEvents = Events.getAll();

  $scope.eventsByDate = '';

  $scope.generateTimeSpan = function(numDays) {
  	const day = 1000 * 60 * 60 * 24;
  	const today = Date.now();
  	let dateArray = [today];
  	for (var i = 1; i < numDays; i++) {
  		dateArray.push(dateArray[i-1] + day);
  	};
  	$scope.sortEventsByDate(dateArray.map(day => new Date(day)));
	};

	$scope.sortEventsByDate = function(timespanArray) {
		$scope.eventsByDate = timespanArray.map(function(date){
			return {
				date: date,
				events: $scope.allEvents.filter(function(event) {
					if (event === undefined) return false; 
					return $scope.compareDates(date, event.e_time)
				})
			}
		});
	}

	$scope.compareDates = function(parentDate, childDate) {
		childDate = new Date(childDate);
		if (parentDate.getFullYear() !== childDate.getFullYear()) return false; 
		if (parentDate.getMonth() !== childDate.getMonth()) return false; 
		if (parentDate.getDate() !== childDate.getDate()) return false; 
		return true; 	
	};

  $scope.getSourceImage = sourceName => Events.getSourceImage(sourceName);

  $scope.dance = function(){
  	console.log($scope.eventsByDate);
  };

  $scope.generateTimeSpan(7);

  $scope.dance();

}]);
