var headModuleVar = angular.module("headModule");

headModuleVar.controller('serviceRequestsController',["$rootScope", "$scope", "$http", "$location",function($rootScope, $scope, $http, $location){
	$rootScope.homePage = false;
	if(!$rootScope.loggedIn){
		$rootScope.errorMessageNavBar = "Login To Open Menu";
		$rootScope.disableErrorBar();
		$location.url("/");
	}

	else{
		$http({
			method:"GET",
			url: "/getServiceRequests?userEmail="+$rootScope.userEmail
		 	}).then(function successCallback(response) {
			$scope.activeRequests = response.data.active;
			$scope.completedRequests = response.data.completed;

			$scope.completedRequests.forEach(function(request, index){
				$scope.completedRequests[index].date =  request.date.substr(0,10);
			})

			$scope.activeRequests.forEach(function(request, index){
				$scope.activeRequests[index].date =  request.date.substr(0,10);
			})
						}, function errorCallback(response) {
		});
	$scope.openModal = function(requestDetails){
		$scope.requestType = (requestDetails.status == "Processing") ? "Active Request" : "Completed Request";
		$rootScope.modalContent = requestDetails;
		$rootScope.modalContent.date = ($scope.modalContent.date);
	}
	}
}]);