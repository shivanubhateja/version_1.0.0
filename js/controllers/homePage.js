var headModuleVar = angular.module("headModule");

headModuleVar.controller("homeController",['$scope','$rootScope',function($scope, $rootScope){
	$rootScope.homePage = true;
	// $scope.showw = false;
	$scope.selectedDevice = "laptop";
	$scope.availability = {};
	$scope.availability.isAvailable = true;
	$scope.availability.checkAvaiability = function(){
		$scope.availability.isAvailable = false;
	}
	$scope.borderStyleLaptop = {
				'border-bottom':'none',
				'padding-bottom':'21px',
				'border-color':'#3d3d3d'
			};
	$scope.borderStyleDesktop =  {
				'border-bottom':'solid 1px',
				'padding-bottom':'20px',
				'border-color':'#3d3d3d'
			};
	$scope.selection = function(selectedDevice){
		$scope.selectedDevice = selectedDevice;
		if(selectedDevice === 'desktop')
		{
			$scope.borderStyleDesktop = {
				'border-bottom':'none',
				'padding-bottom':'21px',
				'border-color':'#3d3d3d'
			};
			$scope.borderStyleLaptop = {
				'border-bottom':'solid 1px',
				'padding-bottom':'20px',
				'border-color':'#3d3d3d'
			};
;
		}
		else
		{
			$scope.borderStyleLaptop = {
				'border-bottom':'none',
				'padding-bottom':'21px',
				'border-color':'#3d3d3d'
			};
			$scope.borderStyleDesktop = {
				'border-bottom':'solid 1px',
				'padding-bottom':'20px',
				'border-color':'#3d3d3d'
			};
		}
	}
}])