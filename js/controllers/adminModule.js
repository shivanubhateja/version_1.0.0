angular.module("adminApp",['ngCookies']).controller('AdminController',["$scope","$http", "$cookies",function($scope, $http, $cookies){
	$scope.adminDetails = {};
	$scope.loginResponse = {};
	$scope.adminDetails.userName = "";
	$scope.adminDetails.password = "";
	$scope.adminLoggedIn = false;
	$scope.loginResponse.message = '';
	$scope.adminLoginCheck = function(){
		$http({
  			method: 'POST',
  			url: '/adminLoginRequest',
  			data: {username : $scope.adminDetails.userName , password : $scope.adminDetails.password}
			}).then(function successCallback(response) {
				if(response.loginSuccess == true){
					$cookies.putObject("adminLoggedInCookie", true);
					$scope.adminLoggedIn = true;
				}
				else{
					$cookies.putObject("adminLoggedInCookie", false);
					$scope.adminLoggedIn = false;
					$scope.loginResponse.message = response.message;
				}
			},
			function failCallback(response){
					$cookies.putObject("adminLoggedIn", false);
					$scope.adminLoggedIn = false;
					$scope.loginResponse.message = response.message;
			})
	}
}]);