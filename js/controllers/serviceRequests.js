var headModuleVar = angular.module("headModule");

headModuleVar.controller('serviceRequestsController',["$rootScope","$scope","$http",function($rootScope,$scope,$http){
	if(!$rootScope.loggedIn){
		$rootScope.errorMessageNavBar = "Login To Open Menu";
		$rootScope.disableErrorBar();
		$location.url("/");
	}

	else{
	    console.log($rootScope.userEmail)
		$http({
			method:"GET",
			url: "/getServiceRequests?userEmail="+$rootScope.userEmail
		}).then(function successCallback(response) {
			console.log(JSON.stringify(response))
			$scope.activeRequests = response.data.active;
			$scope.completedRequests = response.data.completed;
			$scope.dateOfActiveRequest = ($scope.activeRequests[0].date).substr(0,10);
			for(request in $scope.completedRequests){
				request.date = (request.date).substr(0,10);
			}
						}, function errorCallback(response) {

			  });
	$scope.openModal = function(requestDetails){
	$scope.requestType = (requestDetails.status == "Processing") ? "Active Request" : "Completed Request";
	$scope.modalContent = requestDetails;
	$scope.modalContent.date = ($scope.modalContent.date).substr(0,10);
	}
	}
}]);