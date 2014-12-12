angular.module('pledgr.charityList', [])

.controller('CharityListController', function($scope, $http, $stateParams, CharityListFactory){

	$scope.getCharityList = function(){
		CharityListFactory.getCharityList().then(function(data){
			console.log(data);
			$scope.charities = data;
		});
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