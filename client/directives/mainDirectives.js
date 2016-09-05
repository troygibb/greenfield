angular.module('greenfield.directives', [])
.directive('eventWidget', function(){
  return {
  	//Restricts usage only to HTML elements. 
    restrict: 'E',
    //To ensure that the widget has access to parent's methods. 
    transclude: true,
    templateUrl: 'client/directives/eventWidget.html'
  };
})
.directive('eventList', function(){
	return {
		//Restricts usage only to HTML elements. 
	  restrict: 'E',
	  //To ensure that the widget has access to parent's methods. 
	  transclude: true,
	  templateUrl: 'client/directives/eventList.html'
	};
});