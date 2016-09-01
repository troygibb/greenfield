angular.module('greenfield.auth', [])
.controller('AuthController', ['$scope', function($scope) {
  $scope.username= '';
  $scope.password= '';
  $scope.signin = function(){
    let inputInfo = {};
    let user = $scope.username;
    inputInfo[user] = $scope.password;
    console.log(inputInfo);
  };
}]);
