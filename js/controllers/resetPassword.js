angular.module("resetApp",[]).controller('resetController', ['$scope', '$location', '$http', '$timeout', function($scope, $location, $http, $timeout){
	var token = location.search.split("=")[1];
	$scope.reset = {};
	$scope.reset.password = "";
	$scope.reset.confirmPassword = "";
	$scope.reset.status = false;
	$scope.resetPassword = function(){
		$http({
			method:"POST",
			url:"/resettingPassword",
			data:{token: token, password: $scope.reset.password}
		}).then(function(response){
			if(response.data = "success"){
				$scope.reset.status = true
			}
		}, function(response){})
	}
	$scope.goToHome = function(){
		window.location.href = '/';
		
	}
}])