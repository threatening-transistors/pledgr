angular.module('pledgr.charityList', [])

.controller('CharityListController', function($scope, $http, $stateParams, CharityListFactory){

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
		$('.pay-modal').modal();
	};

	$scope.getCharityList();

})


.factory('CharityListFactory', function($http){

	var getCharityList = function(){
		return $http({
			http:'GET',
			url:'/api/charityUser/'
		}).then(function(res){
			return res.data;
		});
	};

	return {
		getCharityList: getCharityList
	};
});