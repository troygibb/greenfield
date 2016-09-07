angular.module('greenfield', [
  'greenfield.services', 
  'greenfield.eventList',
  'greenfield.events',
  'greenfield.auth',
  'greenfield.userEvents',
  'greenfield.directives',
  'ngRoute'
])
.config(function($routeProvider, $httpProvider){
  $routeProvider
  .when('/', {
    templateUrl: 'client/events/events.html',
    controller: 'EventsController'
  })
  .when('/getEvents', {
    templateUrl: 'client/eventList/eventList.html',
    controller: 'EventListController'
  })
  .when('/signin', {
    templateUrl: 'client/auth/signin.html',
    controller:'AuthController'
  })
  .when('/signup', {
    templateUrl: 'client/auth/signup.html',
    controller: 'AuthController'
  })
  .when('/userEvents', {
    templateUrl: 'client/userEvents/userEvents.html',
    controller: 'UserEventsController',
    authenticate: true,
  })
  $httpProvider.interceptors.push('AttachTokens');
})

.controller('MainController', ['$scope', 'Events', 'Auth','$location', function($scope, Events, Auth, $location) {
    Events.getCurrentPosition(function(zip) {
      $scope.zip = zip;
    })
    $scope.validZip = true;  
    $scope.loading = false; 
    $scope.checkZip = function() {
      $scope.validZip = /^\d{5}$/.test($scope.zip);
      return /^\d{5}$/.test($scope.zip);
    };
    $scope.getEvents = function() {
      $scope.loading = true; 
      if ($scope.checkZip()) {
        Events.getEvents($scope.zip)
          .then(function(events){
            $scope.loading = false; 
            $location.path('/getEvents');
          })
          .catch(function(err){
            console.error(err);
          });
      };
    };

    $scope.signout = function() {
      Auth.signout()
    }
}])
.factory('AttachTokens', function ($window) {
  var attach = {
    request: function (object) {
      var jwt = $window.localStorage.getItem('com.hsb');
      if (jwt) {
        object.headers['x-access-token'] = jwt;
      }
      object.headers['Allow-Control-Allow-Origin'] = '*';
      return object;
    }
  };
  return attach;
})
.run(function ($rootScope, $location, Auth) {
  $rootScope.$on('$routeChangeStart', function (evt, next, current) {
    if (next.$$route && next.$$route.authenticate && !Auth.isAuth()) {
      $location.path('/signin');
    }
  });
});

