angular.module('pledgr.signin', [])

.factory('charityLogin', function($http, $window){
  var service = {};

  service.charitySignin =function(charitySignin){
    return $http.post('/api/charityuser/signin', charitySignin)
    .then(function(token){
      console.log('token: ', token.data);
      $window.localStorage.setItem('token', token.data.token);
      return token.data;
    });
  }
  return service;
})
.controller('SignInController', function($scope, charityLogin, $window, Auth, $location) {
  $scope.invalid = false;

  $scope.signin = function() {
    charityLogin.charitySignin({
      email: $scope.username,
      password: $scope.password
    }).then(function(res){
      if($window.localStorage.getItem('token') === "undefined"){
        $scope.invalid = true;
        $scope.username = "";
        $scope.password = "";
        console.log("$scope.invalid: ", $scope.invalid);
    }else{
      console.log("trying to change location");
      $scope.invalid = false;
      $location.path("/charities/3629/3628/3680");
    }    
  })
}


});


// .success(function(token) {
//         $window.localStorage.setItem('token', token);
//         // $location.path('/userhome');
//       })
//       .catch(function(error) {
//         console.error(error);
//       });