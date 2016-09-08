angular.module('greenfield.userEvents', [])
.controller('UserEventsController', ['$scope', 'Events', 'EventCache', 'EventOrganizer', function($scope, Events, EventCache, EventOrganizer){
  EventCache.getEvents()
    .then(function(data){
      EventCache.savedEvents = data;
    }).then(function() {
      $scope.savedEvents = EventCache.savedEvents;
    	$scope.eventsByDate = EventOrganizer.generateTimeSpan($scope.savedEvents, 7);
    	$scope.inCalendar = true; 
    	$scope.getSourceImage = sourceName => Events.getSourceImage(sourceName);
    	//Handle undefined image sources. 
    	$scope.checkImage = source => source ? source : './client/assets/default.png'; 
    	$scope.deleteUserEvent = function(eventObject){
    		let toBeDeleted = eventObject.e_title;
    		$scope.savedEvents = $scope.savedEvents.filter(event => event.e_title !== toBeDeleted);
    	};
    })
}]);