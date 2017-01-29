var headModuleVar = angular.module("headModule");

headModuleVar.controller('invitationController',['$scope','$rootScope', '$http', '$location', function($scope, $rootScope, $http, $location){
	if($rootScope.loggedIn){
		$rootScope.errorMessageNavBar = "You are already member";
		$rootScope.disableErrorBar();
		$location.url("/panel");
	}
	else{
		$scope.referSignUp = {};
		$scope.referSignUp.referralCode = $location.search().referralFrom;
		// $scope.referSignUp.referredTo = $location.search().referredTo;
		$scope.referSignUp.mobileNo = '';
	
		$scope.signUpRefer = function(){
		$scope.loading = true;
		$http({
			method: 'POST',
  			url: '/signUpRequestRefer',
  			data: {
  					userEmail : $scope.referSignUp.referredTo, 
  					password : $scope.referSignUp.passwd, 
  					firstName : $scope.referSignUp.name, 
  					contactNo : $scope.referSignUp.contactNo,
  					referralCode : $scope.referSignUp.referralCode
  				}			
		}).then(function successCallback(response){
		$scope.loading = false;
		if(response.data.response === "alreadyExists"){
			$rootScope.errorMessageNavBar = "Email Address Provided is Already Exists";
			$rootScope.disableErrorBar();
		}
		else if(response.data.response === "waitingForActivation"){
			$rootScope.errorMessageNavBarSuccess = "Successfully Registered, Please Check Your Email For Activation Link";
			$rootScope.disableErrorBarSuccess();
		}
		else if(response.data.response === "failedToSendMailRegisterLater"){
			$rootScope.errorMessageNavBar = "Sorry, we are unable to send email right Now, but You can enquire or book an engineer without logging in";
			$rootScope.disableErrorBar();
		} 
		},function errorCallback(response){})
		//check if user already exists


		//send email to mail address
	}
	}
}]);