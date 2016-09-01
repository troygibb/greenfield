angular.module('greenfield.auth', [])
.controller('AuthController', ['$scope', function($scope) {
  $scope.username= '';
  $scope.password= '';
  $scope.signin = function(){
    console.log($scope.username);
  };
}]);
