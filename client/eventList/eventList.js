angular.module('greenfield.eventList', [])
.controller('EventListController', ['$scope', 'Events', function($scope,  Events) {
  //$scope.img = `assets/meetup-128.png`
  $scope.allEvents = Events.getAll();

  $scope.eventsByDate = '';

  $scope.removeDups = function(){
    const events = $scope.allEvents;
    events.forEach(function(thisEvent, index) {
      let cats = thisEvent.e_categories;
      for(let i = index + 1; i < events.length; i++) {
        if(thisEvent.e_title === events[i].e_title && cats) {
          cats = cats.concat(events[i].e_categories);
        }

        if(cats) {
          thisEvent.e_categories =
          cats.filter((cat, index) => index === cats.indexOf(cat));
        }
      }
    });

    const evRev = events.reverse();

    $scope.allEvents = evRev.filter(function(event, index) {
      for(let i = index + 1; i < events.length; i++) {
        if(event.e_title === evRev[i].e_title && 
          event.e_time === evRev[i].e_time) {
          return false
        };
      }
      return true;
    }).reverse();
  }();

  $scope.generateTimeSpan = function(numDays) {
  	const day = 1000 * 60 * 60 * 24;
  	const today = Date.now();
  	const dateArray = [today];
  	for (let i = 1; i < numDays; i++) {
  		dateArray.push(dateArray[i-1] + day);
  	};
    
  	$scope.sortEventsByDate(dateArray.map(day => new Date(day)));
	};

	$scope.sortEventsByDate = function(timespanArray) {
		$scope.eventsByDate = timespanArray.map(function(date){
			return {
				date: date,
				events: $scope.allEvents.filter(function(event) {
          return event === undefined ?
            false : $scope.compareDates(date, event.e_time);
				})
			}
		});
	}

	$scope.compareDates = function(parentDate, childDate) {
		childDate = new Date(childDate);
    return parentDate.setHours(0, 0, 0, 0) === childDate.setHours(0, 0, 0, 0);
	};

  $scope.getSourceImage = sourceName => Events.getSourceImage(sourceName);

  $scope.dance = () => console.log($scope.eventsByDate);

  //$scope.removeDups();
  $scope.generateTimeSpan(7);
  $scope.dance();

  console.log($scope.allEvents);

  //ADDED---------------------------------------------------------------------------------

  $scope.distances = [
    "0.5 miles",
    "10 miles"
  ];

  $scope.filteredEvents = [...$scope.allEvents];

  $scope.filter = function(){
    // $scope.filteredEvents = $scope.allEvents.filter(function(event) {

    // });
  };

  $scope.logDistance = () => console.log($scope.selectedDistance)

  //ADDED---------------------------------------------------------------------------------

}]);