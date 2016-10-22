// $(document).ready(function(){
//     $('[data-toggle="tooltip"]').tooltip();   
// });

var headModuleVar = angular.module('headModule',["ngRoute","ngTouch","ngCookies"]);

headModuleVar.config(['$locationProvider','$routeProvider',function config($locationProvider, $routeProvider){
$routeProvider.
otherwise({redirectTo: '/'}).
when('/panel',{
	templateUrl : "/html/panel.html",
	controller : "panelController"
}).
when('/request',{
	templateUrl : "/html/requestRegister.html",
	controller : "requestController"
}).
when('/serviceRequests',{
	templateUrl:"/html/serviceRequests.html",
	controller:"serviceRequestsController"
}).
when('/accountActivation',{
	templateUrl:"/html/accountActivation.html",
	controller:"accountActivationController"
}).
when('/bookingDone',{
	templateUrl:"/html/bookingDone.html",
	controller:"bookingController"
}).
when('/',{
	templateUrl:"/html/homePage.html",
	controller:"homeController"
}).
when('/terms',{
	templateUrl:"/html/terms.html",
	controller:"informationController"
}).
when('/privacy-policy',{
	templateUrl:"/html/privacy-policy.html",
	controller:"informationController"
})
}]);
headModuleVar.controller('mainController',["$rootScope","$scope","$http","$location","$cookies",function($rootScope,$scope,$http,$location,$cookies){
	if($cookies.getObject("loggedIn") === true){
		$rootScope.loggedIn = true;
	}
	else{
		$rootScope.loggedIn = false;
	}
	$scope.activationEmailSent={};
	$rootScope.errorMessageNavBar = "";
	$rootScope.errorMessageNavBarSuccess = "";
	$scope.brandName="brandName";
	$scope.loginButton="Login";
	$scope.enquiry = {};
	$scope.enquiry.enquirySentFlag = false;
	$rootScope.userEmail = localStorage.getItem('userEmailLocal');

	$rootScope.disableErrorBar = function(){
	 setTimeout(function(){
	 	$rootScope.errorMessageNavBar = "";
	 	$rootScope.errorMessageNavBarSuccess = "";
	 	$rootScope.$apply()
	},3000)
	};
	$rootScope.disableErrorBarSuccess = function(){
	 setTimeout(function(){
	 	$rootScope.errorMessageNavBar = "";
	 	$rootScope.errorMessageNavBarSuccess = "";
	 	$rootScope.$apply()
	},5000)
	};
	$scope.login = function(){
		$rootScope.userEmail = document.getElementById("userEmail").value;
		$scope.password= document.getElementById("password").value;

		$http({
  			method: 'POST',
  			url: '/loginRequest',
  			data: {userEmail : $rootScope.userEmail , password : $scope.password}
			}).then(function successCallback(response) {	
				if(!response.data.loginSuccess){
					//login failed
					$scope.invalidCredentials = true;
					$cookies.putObject("loggedIn",false);
					// localStorage.setItem("loggedInLocal",false);
					$rootScope.loggedIn = false;
					var loginErrorReason = response.data.message;
					if(loginErrorReason === "accountInActive"){
						$rootScope.errorMessageNavBar = "Please Activate Your Account Through Email";
						$rootScope.disableErrorBar();
					}
					else if(loginErrorReason == "passwordIncorrect"){
						$rootScope.errorMessageNavBar = "Incorrect Password";
						$rootScope.disableErrorBar();
					}
					else if(loginErrorReason == "userDoesNotExist"){
						$rootScope.errorMessageNavBar = "You are Not Registered With us Please Sign Up";
						$rootScope.disableErrorBar();
					}
				}
				else if(response.data.loginSuccess)
				{
					$cookies.putObject("loggedIn",true)
					// localStorage.setItem("loggedInLocal",true);
					$rootScope.loggedIn = true;
					console.log("logged in set to TRUE");
					localStorage.setItem("userEmailLocal",$rootScope.userEmail);
					$location.url("/panel")
				}
			}, function errorCallback(response) {
			    // called asynchronously if an error occurs
 			   // or server returns response with an error status.
			  });
	};
	$scope.signUp = function(){
		$scope.loading = true;
		userEmailSignUp = document.getElementById("userEmailSignUp").value;
		passwordSignUp =  document.getElementById("passwordOne").value;
		firstName =  document.getElementById("userNameSignUp").value;
		contactNo =  document.getElementById("contactNo").value;

		$http({
			method: 'POST',
  			url: '/signUpRequest',
  			data: {userEmail : userEmailSignUp, password : passwordSignUp, firstName : firstName, contactNo : contactNo}			
		}).then(function successCallback(response){
		$scope.loading = false;
		if(response.data.response === "alreadyExists"){
			$rootScope.errorMessageNavBar = "Email Address Provided is Already Exists";
			$rootScope.disableErrorBar();
		}
		else if(response.data.response === "waitingForActivation"){
			console.log("onnas")
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
	$scope.logout = function(){
		$rootScope.loggedIn = false;
		// localStorage.loggedInLocal = false;
		$cookies.putObject("loggedIn",false);
		$location.url("/");
		localStorage.removeItem("deviceTypeLocal");
		localStorage.removeItem("serviceTypeLocal");
	}
	$scope.recovery = {};
	$scope.recovery.recoveryEmailSent = false;
	$scope.recoverPassword = function(email){
		$scope.loadingInModal = true;
		$http({
			method:"GET",
			url:'/sendPasswordRecoveryEmail?user='+email
		}).then(function successCallback(response){
					$scope.loadingInModal = false;
					$scope.recovery.recoveryEmailSent = true;
		},function errorCallback(response){
			console.log("failed")
		})
	}
	$scope.activationEmailSent.flag = false;
	$scope.resendActivationEmail = function(email){
		$scope.loadingInModal = true;
		$http({
			method:'GET',
			url:'/resendActivationEmail?user='+email
		}).then(function successCallback(response){
			$scope.loadingInModal = false;
			$scope.activationEmailSent.flag = true;
		},function errorCallback(response){})
	}
	$scope.engineerBook = function(){
		localStorage.removeItem("deviceTypeLocal");
		localStorage.removeItem("serviceTypeLocal");
		$location.path("/request");
	}
	$scope.goToHomePage = function(){
		$location.path('/');
	}
	$scope.enquiry.submitEnquiry = function(){
		$http({
			method:"POST",
			url:"/submitEnquiry",
			data: {emailId: $scope.enquiry.userEmail, query: $scope.enquiry.query, phoneNo : $scope.enquiry.phoneNo}
		}).then(function successCallback(response){
				$scope.enquiry.enquirySentFlag = true;
		}, function failCallback(){})
	}
	$scope.issueTypeListDesktop=[
			"Display Malfunction.",
			"LCD/LED damages or complete broken down.",
			"PC turns on and off repeatedly.",
			"Repetitive beep sound on startup.",
			"Keyboard Problem.",
			"Virus/Malware",
			"Password recovery",
			"Liquid spills",
			"Internet connection difficulties",
			"Data Recovery"

		];

	$scope.issueTypeListLaptop=[
			"Monitor Malfunction.",
			"PC turns on and off repeatedly.",
			"Laptop makes noise while running.",
			"Repetitive beep sound on startup.",
			"Keyboard Problem.",
			"Virus/Malware",
			"Password recovery",
			"Liquid spills",
			"Internet connection difficulties",
			"Data Recovery",
			"Other"

		];
	
}]);	