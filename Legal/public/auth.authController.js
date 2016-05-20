angular
    .module('auth')
    .controller('authController', authController);

 
  
function authController ($scope, $http) {
    ///Init
    $scope.login_show = true;
	$scope.logged_in_as_show = false;
	$scope.logged_in_as = "";
	
	//check to see if we're already logged in
	$scope.getCurrentLoggedInUser = function(callback)  {
		$http.get('/getCurrentUser' )
        .success(function(data) {
			//$scope.firmCount = data.length;
            //console.log("notes"+data);
			callback(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
    })};
	
	$scope.getCurrentLoggedInUser(function(data){
		if(data){
			$scope.login_show = false;
			$scope.logged_in_as_show = true;
			$scope.logged_in_as = data.username;
		}    
	});
	
	//// End Init
  
    $scope.toggle_login_show = function() {
		$scope.login_show = !$scope.login_show;
	};	 
  
    $scope.login = function () {

		// initial values
		$scope.login_message_show = false;
		$scope.disabled = false;
		$scope.login_message = "";
      
		var data = {"username" : $scope.loginForm.username, "password" : $scope.loginForm.password};
		//console.log(data);
		$http.post('/user/login', data).then(function successCallback(response) {
			// this callback will be called asynchronously
			// when the response is available
			if (response.status == 200) {
				$scope.login_show = false;
				$scope.logged_in_as = $scope.loginForm.username;
				$scope.logged_in_as_show = true;

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
    $http.post('/user/register', data).then(function successCallback(response) {
			// this callback will be called asynchronously
			// when the response is available
			if (response.status == 200) {
				$scope.login_message_show = true;
				$scope.login_message = "Success -- Registered!"
			} else {
				$scope.login_message_show = true;
				$scope.login_message = "Register Failure!"
			}
		}, function errorCallback(response) {
			// called asynchronously if an error occurs
			// or server returns response with an error status.
	        $scope.login_message_show = true;
			$scope.login_message = "Register Failure! " + response.data.err.message;
		});;

    };
	
	//TBD logout

}