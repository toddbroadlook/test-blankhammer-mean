angular
	.module('auth')
	.controller('authController', ['$scope', '$http',authController]);

  
  function authController ($scope, $http) {

    $scope.login = function () {

		// initial values
		$scope.login_message_show = false;
		$scope.disabled = false;
		$scope.login_message = "";
      
		var data = {"username" : $scope.loginForm.username, "password" : $scope.loginForm.password};
		console.log(data);
		$http.post('/user/login', data).then(function successCallback(response) {
			// this callback will be called asynchronously
			// when the response is available
			if (response.status == 200) {
				$scope.login_message_show = true;
				$scope.login_message = "Success -- Logged in!"
			} else {
				$scope.login_message_show = true;
				$scope.login_message = "Login Failure!"
			}
		}, function errorCallback(response) {
			// called asynchronously if an error occurs
			// or server returns response with an error status.
	        $scope.login_message_show = true;
			$scope.login_message = "Login Failure! " + response.data.err.message;
		});;

    };
	
	$scope.register = function () {

      // initial values
      $scope.error = false;
      $scope.disabled = false;

      /*var data = $.param({
        json: JSON.stringify({
            username: $scope.loginForm.username,
            password: $scope.loginForm.password
        })
      });*/
      
    var data = {"username" : $scope.loginForm.username, "password" : $scope.loginForm.password};
    console.log(data);
    $http.post('/user/register', data);

    };
	
	//TBD logout

}