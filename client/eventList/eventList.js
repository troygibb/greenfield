angular.module('greenfield.eventList', [])
.controller('EventListController', ['$scope', 'Events', 'EventOrganizer', 'EventCache', function($scope,  Events, EventOrganizer, EventCache) {
  //$scope.img = `assets/meetup-128.png`

  $scope.categories = [];
  $scope.allEvents = removeDups(Events.savedEvents);
  $scope.eventsByDate = '';
  $scope.searchText = '';

  //For showing 'addToCalendar button'
  $scope.inCalendar = false; 

  $scope.searchCategory = function(category) {
    $scope.searchText = category;
  };

  $scope.addToUserEvents = function(eventObject){
    EventCache.savedEvents.push(eventObject);
  };

  //TODO: Try to implement this on the backend?
  function removeDups(events){
    const eventsCopy = [...events];
    eventsCopy.forEach(function(thisEvent, index) {
      let cats = thisEvent.e_categories;
      //Adding to categories set (conditional for null type checking): 
      if (cats) cats.forEach(cat => {
        $scope.categories.indexOf(cat) == -1 ? $scope.categories.push(cat) : null;
      });
      for(let i = index + 1; i < eventsCopy.length; i++) {
        if(thisEvent.e_title === eventsCopy[i].e_title && cats) {
          cats = cats.concat(eventsCopy[i].e_categories);
        }

        if(cats) {
          thisEvent.e_categories =
          cats.filter((cat, index) => index === cats.indexOf(cat));
        }
      }
    });
    const evRev = eventsCopy.reverse();
    return $scope.allEvents = evRev.filter(function(event, index) {
      for(let i = index + 1; i < eventsCopy.length; i++) {
        if(event.e_title === evRev[i].e_title && 
          event.e_time === evRev[i].e_time) {
          return false
        };
      }
      return true;
    }).reverse();
  };

  $scope.getSourceImage = sourceName => Events.getSourceImage(sourceName);

  //Handle undefined image sources. 
  $scope.checkImage = source => source ? source : './client/assets/default.png'; 

  $scope.logEvents = () => console.log($scope.eventsByDate);

  $scope.eventsByDate = EventOrganizer.generateTimeSpan($scope.allEvents, 7);
  $scope.logEvents();

  $scope.distances = [
    "0.5 miles",
    "10 miles"
  ];

  $scope.logCats = () => console.log($scope.categories)
  $scope.logDistance = () => console.log($scope.selectedDistance)
}]);