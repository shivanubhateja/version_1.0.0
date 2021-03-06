var headModuleVar = angular.module("headModule");

headModuleVar.controller('profileController',['$rootScope', '$scope', '$http', '$location', function($rootScope, $scope, $http, $location){
	var clipboard = new Clipboard('.copybtn');
	$rootScope.homePage = false;
	if(!$rootScope.loggedIn){
		$rootScope.errorMessageNavBar = "Login To Open Menu";
		$rootScope.disableErrorBar();
		$location.url("/");
	}
	else{
		$scope.reset = {};
		$scope.reset.status = false;
		$scope.canEdit = false;
		$scope.userDetailsChanges = {};
		$scope.userDetailsChanges.name = $rootScope.userDetails[1];
		$scope.userDetailsChanges.email = $rootScope.userDetails[0];
		$scope.userDetailsChanges.phone = $rootScope.userDetails[2];
		$scope.userDetailsChanges.address = $rootScope.userDetails[4];
		$scope.editEnable = function(){
			$(".editFormDetails").attr("readonly",false);
			$scope.canEdit = true;
		}
		$scope.cancelEdit = function(){
			$scope.canEdit = false;	
			$(".editFormDetails").attr("readonly",true);
		}
		$scope.uploadUserDetails =function(){
			$http({
				method: "GET",
				url: "/editUserDetails?name="+$scope.userDetailsChanges.name+"&phone="+$scope.userDetailsChanges.phone+"&address="+$scope.userDetailsChanges.address+"&code="+$rootScope.userDetails[3]
		}).then(function successCallback(response){
			if(response.data === "success"){
				$(".editFormDetails").attr("readonly",true);
				$scope.canEdit = false;	
				$rootScope.userDetails[1] = $scope.userDetailsChanges.name;
				$rootScope.userDetails[2] = $scope.userDetailsChanges.phone;
				$rootScope.userDetails[4] = $scope.userDetailsChanges.address;
				localStorage.setItem("userDetails",$rootScope.userDetails[0]+"&$&$" +$scope.userDetailsChanges.name+"&$&$"+ $scope.userDetailsChanges.phone +"&$&$"+$rootScope.userDetails[3] +"&$&$"+$scope.userDetailsChanges.address);
			}
			else{
				alert("Some Error Occured")
			}
		}, function failureCallback(){

		})
		}
		$scope.changePassword = function(){
			$scope.reset.status = true;
		}
		$scope.cancelResetPassword = function(){
			$scope.reset.status = false;
			$scope.reset.confirmPassword = "";
			$scope.reset.password = "";
		}
		$scope.resetPassword = function(){
		$http({
			method:"POST",
			url:"/resettingPassword",
			data:{token: $rootScope.userDetails[0], password: $scope.reset.password}
		}).then(function(response){
			if(response.data = "success"){
				$rootScope.errorMessageNavBarSuccess = "Password Successfully Changed";
				$rootScope.disableErrorBarSuccess();
				$scope.reset.status = false;
				$scope.reset.confirmPassword = "";
				$scope.reset.password = "";
			}
		}, function(response){})
	}
	}
}]);