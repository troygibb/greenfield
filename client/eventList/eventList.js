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

  $scope.logCats = () => console.log($scope.categories);
  $scope.logDistance = () => console.log($scope.selectedDistance);







  $scope.addToGoogleCal = function(event){
    checkAuth();
    console.log(event); return;
    const event = {
      'summary': 'Google I/O 2015',
      'location': '800 Howard St., San Francisco, CA 94103',
      'description': 'A chance to hear more about Google\'s developer products.',
      'start': {
        'dateTime': '2015-05-28T09:00:00-07:00',
        'timeZone': 'America/Los_Angeles'
      },
      'end': {
        'dateTime': '2015-05-28T17:00:00-07:00',
        'timeZone': 'America/Los_Angeles'
      },
    };

    const request = gapi.client.calendar.events.insert({
      'calendarId': 'primary',
      'resource': event,
    });

    request.execute(function(event) {
      appendPre('Event created: ' + event.htmlLink);
    });

  };


      // Your Client ID can be retrieved from your project in the Google
      // Developer Console, https://console.developers.google.com
      var CLIENT_ID = '120023726722-uagad38dtrell6968ptak9n1oqfg76bj.apps.googleusercontent.com';

      var SCOPES = ["https://www.googleapis.com/auth/calendar"];


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
          // Hide auth UI, then load client library.
          authorizeDiv.style.display = 'none';
          loadCalendarApi();
        } else {
          // Show auth UI, allowing the user to initiate authorization by
          // clicking authorize button.
          authorizeDiv.style.display = 'inline';
        }
      }

      /**
       * Initiate auth flow in response to user clicking authorize button.
       *
       * @param {Event} event Button click event.
       */
      function handleAuthClick(event) {
        gapi.auth.authorize(
          {client_id: CLIENT_ID, scope: SCOPES, immediate: false},
          handleAuthResult);
        return false;
      }

      /**
       * Load Google Calendar client library. List upcoming events
       * once client library is loaded.
       */
      function loadCalendarApi() {
        gapi.client.load('calendar', 'v3', listUpcomingEvents);
      }

      /**
       * Print the summary and start datetime/date of the next ten events in
       * the authorized user's calendar. If no events are found an
       * appropriate message is printed.
       */
      function listUpcomingEvents() {
        var request = gapi.client.calendar.events.list({
          'calendarId': 'primary',
          'timeMin': (new Date()).toISOString(),
          'showDeleted': false,
          'singleEvents': true,
          'maxResults': 10,
          'orderBy': 'startTime'
        });

        request.execute(function(resp) {
          var events = resp.items;
          appendPre('Upcoming events:');

          if (events.length > 0) {
            for (i = 0; i < events.length; i++) {
              var event = events[i];
              var when = event.start.dateTime;
              if (!when) {
                when = event.start.date;
              }
              appendPre(event.summary + ' (' + when + ')')
            }
          } else {
            appendPre('No upcoming events found.');
          }

        });
      }

      /**
       * Append a pre element to the body containing the given message
       * as its text node.
       *
       * @param {string} message Text to be placed in pre element.
       */
      function appendPre(message) {
        var pre = document.getElementById('output');
        var textContent = document.createTextNode(message + '\n');
        pre.appendChild(textContent);
      }




}]);