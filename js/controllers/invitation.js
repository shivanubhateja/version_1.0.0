var headModuleVar = angular.module("headModule");

headModuleVar.controller('invitationController',['$scope','$rootScope', '$http', '$location', function($scope, $rootScope, $http, $location){
	console.log($rootScope.loggedIn)
	if($rootScope.loggedIn){
		$rootScope.errorMessageNavBar = "You are already member";
		$rootScope.disableErrorBar();
		$location.url("/panel");
	}
	else{
		$scope.referSignUp = {};
		$scope.referSignUp.referralCode = $location.search().referralFrom;
		$scope.referSignUp.referredTo = $location.search().referredTo;
		$scope.referSignUp.mobileNo = '';
		// $http({
		// 	method:"GET",
		// 	url:"checkReferal?referredBy="+$scope.referSignUp.referralCode+"referralFrom"+$scope.referSignUp.referredTo
		// }).then(function successCallBack(){
			
		// }, function failureCallback(){

		// });
	}
}]);