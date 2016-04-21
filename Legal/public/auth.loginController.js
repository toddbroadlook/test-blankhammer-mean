angular
	.module('auth')
	.controller('loginController', ['$scope', '$http',loginController]);

  
  function loginController ($scope, $http) {

    $scope.login = function () {

      // initial values
      $scope.error = false;
      $scope.disabled = true;

      /*var data = $.param({
        json: JSON.stringify({
            username: $scope.loginForm.username,
            password: $scope.loginForm.password
        })
      });*/
      
    var data = {"username" : $scope.loginForm.username, "password" : $scope.loginForm.password};
    console.log(data);
    $http.post('/user/login', data);

    };

}