angular.module("adminApp",['ngCookies']).controller('AdminController',["$scope","$http", "$cookies", "$rootScope",function($scope, $http, $cookies ,$rootScope){
	$rootScope.homePage = false;
	
	$scope.adminDetails = {};
	$scope.loginResponse = {};
	$scope.adminDetails.userName = "";
	$scope.adminDetails.password = "";
	$scope.adminLoggedIn = false;
	$scope.loginResponse.message = '';
	$scope.requests = {}
	$scope.statusObject = {};
	$scope.adminLoginCheck = function(){
		$http({
  			method: 'POST',
  			url: '/adminLoginRequest',
  			data: {username : $scope.adminDetails.userName , password : $scope.adminDetails.password}
			}).then(function successCallback(response) {
				if(response.data.loginSuccess == true){
					$cookies.putObject("adminLoggedInCookie", true);
					$scope.adminLoggedIn = true;
					$scope.fetchPendingRequests();
				}
				else{
					$cookies.putObject("adminLoggedInCookie", false);
					$scope.adminLoggedIn = false;
					$scope.loginResponse.message = response.data.message;
				}
			},
			function failCallback(response){
					$cookies.putObject("adminLoggedIn", false);
					$scope.adminLoggedIn = false;
					$scope.loginResponse.message = response.data.message;
			})
	}
	$scope.fetchPendingRequests = function(){
		$http({
			method: "GET",
			url: "/getServiceRequests "
		}).then(function successCallback(response){
			$scope.requests.activeRequests = response.data.active;
			$scope.requests.completedRequests = response.data.completed;
			$scope.requests.completedRequests.forEach(function(request, index){
				$scope.requests.completedRequests[index].date =  request.date.substr(0,10);
			})

			$scope.requests.activeRequests.forEach(function(request, index){
				$scope.requests.activeRequests[index].date =  request.date.substr(0,10);
			})
		},
		function failCallback(response){

		})
	}
	$scope.changeStatusFromActiveRequest = function(request){
		console.log($scope.statusObject.statusToChange,id);
		
		// var removeIndex = $scope.requests.activeRequests.map(function(item) { return item.id; })
  //                      .indexOf();
		// $scope.requests.activeRequests = $scope.requests.activeRequests.map(function(item){
		// 	if(item === request)
		// })
	}

	$scope.fetchPendingRequests();
}]);