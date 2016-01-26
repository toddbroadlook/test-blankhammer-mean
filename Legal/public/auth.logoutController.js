angular
	.module('auth')
    .controller('logoutController',
  ['$scope', '$location', 'AuthService', logoutController]);

  function logoutController ($scope, $location, AuthService) {

    $scope.logout = function () {

      console.log(AuthService.getUserStatus());

      // call logout from service
      AuthService.logout()
        .then(function () {
          $location.path('/login');
        });

    };

}