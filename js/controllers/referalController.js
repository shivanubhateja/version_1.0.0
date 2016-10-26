var headModuleVar = angular.module("headModule");

headModuleVar.controller('referalController',['$rootScope', '$scope', '$http', '$timeout', '$location',function($rootScope, $scope, $http, $timeout, $location){
	$rootScope.homePage = false;
	if(!$rootScope.loggedIn){
		$rootScope.errorMessageNavBar = "Login To Open Menu";
		$rootScope.disableErrorBar();
		$location.url("/");
	}
	else{
		$scope.referral = {};
		$scope.referral.emailid	= '';
		$scope.referral.displaySent = false;
		$scope.referral.removeSuccessMessage = function(){
			$timeout(function() {
				$scope.referral.displaySent = false;
			}, 3000);
		};
		$scope.referral.sendInvite	= function(){
			$http({
				method:"GET",
				url:"/referral?emailidTo="+$scope.referral.emailid+"&emailidFrom="+$rootScope.userEmail
			}).then(function successCallback(response){
				$scope.referral.emailid	= '';
			},
			 function failCallback(){

			});
			$scope.referral.displaySent = true;
			$scope.referral.removeSuccessMessage();
		}
	}
}]);