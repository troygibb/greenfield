app.controller("MeetupController", ['$scope', 'rmMeetupEventsService', function meetupController($scope, rmMeetupEventsService){
  $scope.getEvent = function(token, id){
    rmMeetupEventsService.getByEventId(token, id).then(function(event){
        $scope.event = event;
    });
  }
  $scope.getEvent()
}]);