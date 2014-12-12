angular.module('pledgr.signup', [])

.factory('charityFactory', function($http){
	var service = {};

	service.addCharity =function(charityData){
		$http.post('/api/charityuser/signup', charityData)
		.success(function(res){
			console.log('response: ', res.data);
		});
	}

	return service;
})

.controller('SignupController', function($scope, charityFactory){
	$scope.showCharity = true;
	console.log('before changed', $scope.showCharity);

    Stripe.setPublishableKey('pk_test_7qhH8GqrwSZvzFQVSWmiMiu1');
    $scope.submit = function(){
    	console.log('in submit');
		Stripe.bankAccount.createToken({
			country: $scope.country,		
			routingNumber: $scope.routingNumber,
			accountNumber: $scope.accountNumber
		}, $scope.stripeResponseHandler);
	}

	$scope.stripeResponseHandler = function(status, response){
		//update database with id's
		charityFactory.	addCharity({
			name: $scope.name, //Org name
			type: $scope.charityType, //Category of charity
			email: $scope.email,
			password: $scope.password,// put hashed version of password
			representative: $scope.rep, //Optional, only useful in corp
			description: $scope.charityDescription,
			website: $scope.charityWebsite,
			bank_account: response.id
		})
	}

	$scope.next = function(){

		$scope.showCharity = !$scope.showCharity;
		console.log('showCharity', $scope.showCharity);
		
	}
});


