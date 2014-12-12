angular.module('pledgr.signin', [])

.factory('charityLogin', function($http){
  var service = {};

  service.charitySignin =function(charitySignin){
    $http.post('/api/charityuser/login', charitySignin)
    .success(function(res){
      console.log('response: ', res.data);
    });
  }

  return service;
})
.controller('SignInController', function($scope, charityLogin, $window, Auth) {
  $scope.user = {
    email: $scope.username,
    password: $scope.password
  };


  $scope.signin = function() {
    charityLogin.charitySignin($scope.user)
      .then(function(token) {
        $window.localStorage.setItem('token', token);
        // $location.path('/userhome');
      })
      .catch(function(error) {
        console.error(error);
      });
  };
});
