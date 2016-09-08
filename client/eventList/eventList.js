angular.module('greenfield.eventList', ['ngOrderObjectBy'])

.constant('_', window._)

.controller('EventListController',
['$scope', 'Events', 'EventOrganizer', 'EventCache', '_', '$http',
function($scope,  Events, EventOrganizer, EventCache, _, $http) {

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
  $scope.checkImage = source => source || './client/assets/default.png'; 
  $scope.logEvents = () => console.log($scope.eventsByDate);
  $scope.logCats = () => console.log($scope.categories);
  $scope.logDistance = () => console.log($scope.selectedDistance);

  $scope.eventsByDate = EventOrganizer.generateTimeSpan($scope.allEvents, 7);
  $scope.logEvents();


  //###########################################################################
  //###########################################################################
  //###########################################################################


  //START Google Calendar api code. Much of this was copied from
  //https://developers.google.com/google-apps/calendar/quickstart/js
  $scope.addToGoogleCalendar = function(event){
    $scope.clickedEvent = event;
    checkAuth();
  };

  // Your Client ID can be retrieved from your project in the Google
  // Developer Console, https://console.developers.google.com
  // client id is meant to be public according to:
  //http://stackoverflow.com/questions/14563155/oauth-2-0-client-id-and-client-secret-exposed-is-it-a-security-issue
  const CLIENT_ID = '120023726722-uagad38dtrell6968ptak9n1oqfg76bj.apps.googleusercontent.com';
  const SCOPES = ["https://www.googleapis.com/auth/calendar"];

  /**
   * Check if current user has authorized this application.
   */
  function checkAuth() {
    gapi.auth.authorize(
      {
        'client_id': CLIENT_ID,
        'scope': SCOPES.join(' '),
        'immediate': true
      }, handleAuthResult);
  }

  /**
   * Handle response from authorization server.
   *
   * @param {Object} authResult Authorization result.
   */
  function handleAuthResult(authResult) {
    var authorizeDiv = document.getElementById('authorize-div');
    if (authResult && !authResult.error) {
      // TODO: Post the event to the user's Google Calendar
      gapi.client.load('calendar', 'v3', postToCalendar);
    } else {
      //Initiate auth flow.
      gapi.auth.authorize(
        {client_id: CLIENT_ID, scope: SCOPES, immediate: false},
        handleAuthResult);
    }
  }

  //much of this function is copied from
  //https://developers.google.com/google-apps/calendar/v3/reference/events/insert
  function postToCalendar(){
    //funcheapSF and Facebook work; seatgeek does not
    const evt = $scope.clickedEvent;
    const loc = evt.e_location || { address: '', city: ''};
    const now = new Date(evt.e_time);

    //end time will be event start time plus 1 hour
    const hourFromNow = new Date(now);
    hourFromNow.setHours(now.getHours() + 1);

    //Start and end times are formatted poorly. A refactor would help.
    //Google requires them to be in a specific format.
    const calEvent = {
      'summary': evt.e_title,
      'location': `${ loc.address || '' }${ loc.address && loc.city ? ', ' : ' '}${ loc.city || ''}`,
      'description': evt.description || '',
      'start': {
         'dateTime': now.toISOString().slice(0, -5) + '-00:00',
      },
      'end': {
         'dateTime': hourFromNow.toISOString().slice(0, -5) + '-00:00',
      },
    };

    const request = gapi.client.calendar.events.insert({
      'calendarId': 'primary',
      'resource': calEvent,
    });

    request.execute();
  }
}]);