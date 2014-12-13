angular.module('pledgr.charityList', [])

.controller('CharityListController', function($scope, $http, $stateParams, CharityListFactory){

	$scope.donationInProgress = false;

	$scope.getCharityList = function(){
		CharityListFactory.getCharityList().then(function(data){
			console.log(data);
			$scope.charities = data;
		});
	};

	$scope.directPay = function(index){
		$scope.paymentBankAccount = $scope.charities[index].bank_account;
		$scope.paymentRecipient = $scope.charities[index].recipient_id;
		$scope.paymentCharity = $scope.charities[index].name;
		$scope.paymentCharityId = $scope.charities[index]._id;
		$('.pay-modal').modal();
	};

	$scope.processDonation = function(){
		var $form = $('#cc-form');
		$('.donate-button').text("Donation in progress!").toggleClass('disabled');
		$scope.donationInProgress = true;
		$scope.startProgressBar();

		$scope.stripeInit();
		
	    Stripe.card.createToken($form, function(status, response){
	    	//console.log(response);
	    	//create transfer
	    	CharityListFactory.makeDonationTransfer({
	    		donor_id: '78agdfouyagd', //herd-curded
	    		charity_id: $scope.paymentCharityId,
	    		amount: 200, //let's make this plz
	    		description: 'Yay, I made a donation!'
	    	}).then(function(data){
	    		console.log('got it', data);
	    	});
	    });
;

	};

	$scope.startProgressBar = function(){
			
		var $bar = $('#xfer-progress');
		var currentVal = $bar.width();
		console.log('currentVal', currentVal);
		
		$scope.interval = setInterval(function(){

			currentVal = $bar.width();
			$bar.width(currentVal + 100);
			$bar.attr('aria-valuenow', currentVal + 100);


		}, 500);

	};

	$scope.stopProgressBar = function(){

	};

	$scope.stripeInit = function(){
		Stripe.setPublishableKey('pk_test_7qhH8GqrwSZvzFQVSWmiMiu1');
	};

	$scope.getCharityList();

})


.factory('CharityListFactory', function($http){

	var getCharityList = function(){
		return $http({
			method:'GET',
			url:'/api/charityUser/'
		}).then(function(res){
			return res.data;
		});
	};

	var makeDonationTransfer = function(xferInfo){
		return $http({
			method:'POST',
			url: '/api/donation/send',
			data: xferInfo
		}).then(function(res){
			console.log("makeDonationTransfer", res.data);
			return res.data;
		});
	}

	return {
		getCharityList: getCharityList,
		makeDonationTransfer: makeDonationTransfer
	};
});