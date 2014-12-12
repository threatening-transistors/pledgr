angular.module('pledgr.signup', [])

.controller('SignupController', function($scope){
	$scope.showCharity = true;
	console.log('before changed', $scope.showCharity);

	// $scope.addCharity = function(){
	// 	$scope.new CharityUser({
	// 		name: $scope.name, //Org name
	// 		type: $scope.charityType, //Category of charity
	// 		email: $scope.email,
	// 		password: $scope.password,// put hashed version of password
	// 		representative: $scope.rep, //Optional, only useful in corp
	// 		website: $scope.charityWebsite,
	// 		//images?
	// 		//stripe info
	// 		recipient_id: null, //returned from createRecipient
	// 		bank_account: null, //stripe bank
	// 		card: null, //stripe - not currently used
	// 		transfers: []
	// 		});
	// }
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
		console.log('response: ', response);
	}

	$scope.next = function(){

		$scope.showCharity = !$scope.showCharity;
		console.log('showCharity', $scope.showCharity);
		// var newCharity = new CharityUser({
		// 	name: $scope.name, //Org name
		// 	type: $scope.charityType, //Category of charity
		// 	email: $scope.email,
		// 	password: $scope.password,// put hashed version of password
		// 	representative: $scope.rep, //Optional, only useful in corp
		// 	website: $scope.charityWebsite,
		// 	//images?
		// 	//stripe info
		// 	recipient_id: null, //returned from createRecipient
		// 	bank_account: null, //stripe bank
		// 	card: null, //stripe - not currently used
		// 	transfers: []
		// 	});
		// newCharity.save(function(err){
		// 	if(err){
		// 		console.log(err);
		// 	}
			
		// });
	}
});
