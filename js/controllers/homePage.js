var headModuleVar = angular.module("headModule");

headModuleVar.controller("homeController",['$scope','$rootScope','$http',function($scope, $rootScope, $http){
	$rootScope.homePage = true;
	// $scope.showw = false;
	$scope.selectedDevice = "laptop";
	$scope.availability = {};
	$scope.availability.location = '';
	$scope.availability.invalidPinCode = false;
	$scope.availability.checkAvaiability = function(){
		delete $scope.availability.isAvailable;
		if(($scope.availability.location+'').length != 6 || typeof $scope.availability.location != "number"){
			$scope.availability.invalidPinCode = true;
		}
		else{
		$http({
			method: 'GET',
			url: '/checkAvailability?location='+$scope.availability.location
		}).then(function successCallback(response){

	$scope.availability.invalidPinCode = false;
			if(response.data.response === true){
				$scope.availability.isAvailable = 'true';
			}
			else{
				$scope.availability.isAvailable = 'false';	
			}
		}, function failureCallback(){
		});
		$scope.availability.emailSaved = false;
		$scope.availability.notifyEmail = function(){
		$http({
			method:"GET", 
			url: "/notifyEmail?email="+$scope.availability.emailid+"&pincode="+$scope.availability.location
		}).then(function (response){
			$scope.availability.emailSaved = true;
		})
	}
	}
	}
	// $scope.borderStyleLaptop = {
	// 			'border-bottom':'none',
	// 			'padding-bottom':'21px',
	// 			'border-color':'#3d3d3d'
	// 		};
	// $scope.borderStyleDesktop =  {
	// 			'border-bottom':'solid 1px',
	// 			'padding-bottom':'20px',
	// 			'border-color':'#3d3d3d'
	// 		};
	// $scope.selection = function(selectedDevice){
	// 	$scope.selectedDevice = selectedDevice;
	// 	if(selectedDevice === 'desktop')
	// 	{
	// 		$scope.borderStyleDesktop = {
	// 			'border-bottom':'none',
	// 			'padding-bottom':'21px',
	// 			'border-color':'#3d3d3d'
	// 		};
	// 		$scope.borderStyleLaptop = {
	// 			'border-bottom':'solid 1px',
	// 			'padding-bottom':'20px',
	// 			'border-color':'#3d3d3d'
	// 		};
	// 	}
	// 	else
	// 	{
	// 		$scope.borderStyleLaptop = {
	// 			'border-bottom':'none',
	// 			'padding-bottom':'21px',
	// 			'border-color':'#3d3d3d'
	// 		};
	// 		$scope.borderStyleDesktop = {
	// 			'border-bottom':'solid 1px',
	// 			'padding-bottom':'20px',
	// 			'border-color':'#3d3d3d'
	// 		};
	// 	}
	// }
}])