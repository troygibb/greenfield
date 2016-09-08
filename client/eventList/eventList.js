angular.module('greenfield.eventList', ['ngOrderObjectBy'])

.constant('_', window._)

.controller('EventListController',
  ['$scope', 'Events', 'EventOrganizer', 'EventCache', '_',
  function($scope,  Events, EventOrganizer, EventCache, _) {
  //$scope.img = `assets/meetup-128.png`


  $scope.allEvents = /*removeDuplicateAndExpiredEvents */(Events.savedEvents);
  $scope.categories = addCategories($scope.allEvents);
  $scope.eventsByDate = '';
  $scope.searchText = '';
  $scope.widgetView = false; 

  //For showing 'addToCalendar button'
  $scope.inCalendar = false; 

  $scope.searchCategory = function(category) {
    $scope.searchText = category;
  };

  $scope.addToUserEvents = function(eventObject){
    EventCache.savedEvents.push(eventObject);
  };
  $scope.sortDate = function(time) {
    let date = time.e_time;
    console.log(new Date(date))
    return new Date(date);
  }

  function oneWeekMS() {
    const now = (new Date()).getTime();
    const oneWeek = now + 1000 * 60 * 60 * 24 * 7;
    return oneWeek;
  }

  function addCategories(events) {
    const categories = {};

    events.forEach((thisEvt) => {
      const cats = thisEvt.e_categories;
      const now = new Date().getTime();
      const nextWeek = oneWeekMS();
      const evtTime = new Date(thisEvt.e_time).getTime();
      cats && now < evtTime && evtTime < nextWeek &&
      cats.forEach(cat => {
        categories[cat] = categories[cat] || {};
        categories[cat].frequency = categories[cat].frequency + 1 || 1;
      });
    });

    return categories;
  };

  //TODO: Try to implement this on the backend?
  function removeDuplicateAndExpiredEvents(events){
    const eventsObj = {};
    console.log(events);

    //turn eventsObj into a dup-free version of events
    events.forEach((thisEvent, index) => {
      //Remove events that have expired or are past 1 week from now
      const now = new Date().getTime();
      const nextWeek = oneWeekMS();
      const evtTime = new Date(thisEvent.e_time).getTime();
      if(evtTime < now || evtTime > nextWeek) {
        //return;
      }

      //if categories is not null
      if(thisEvent.e_categories) {
        for(let i = index + 1; i < events.length; i++) {
          const furtherEvent = events[i];

          //if another event has the same title and categories of its own,
          //concatenate the categories into the 1st event and filter out
          //duplicate categories
          if(furtherEvent.e_categories &&
          thisEvent.e_title === furtherEvent.e_title) {
            thisEvent.e_categories = thisEvent.e_categories
            .concat(furtherEvent.e_categories)
            .filter((cat, index, self) => index === self.indexOf(cat));
          }
        }
      }

      //insert the event into eventsObj if it's the first time we've processed an
      //event with this title
      if(eventsObj[thisEvent.e_title] === undefined) {
        eventsObj[thisEvent.e_title] = thisEvent;
      }
    });

    console.log(eventsObj);

    return _.map(eventsObj, event => event);
  };

  $scope.getSourceImage = sourceName => Events.getSourceImage(sourceName);

  //Handle undefined image sources. 
  $scope.checkImage = source => source ? source : './client/assets/default.png'; 

  $scope.logEvents = () => console.log($scope.eventsByDate);

  $scope.eventsByDate = EventOrganizer.generateTimeSpan($scope.allEvents, 7);
  $scope.logEvents();

  $scope.logCats = () => console.log($scope.categories)
  $scope.logDistance = () => console.log($scope.selectedDistance)
}]);