var headModuleVar = angular.module("headModule");

headModuleVar.controller("homeController",['$scope','$rootScope',function($scope, $rootScope){
	$rootScope.homePage = true;
	// $scope.showw = false;
	$scope.selectedDevice = "laptop";
	$scope.borderStyleLaptop = {
				'border-bottom':'none',
				'padding-bottom':'21px',
				'border-color':'white'
			};
	$scope.borderStyleDesktop =  {
				'border-bottom':'solid 1px',
				'padding-bottom':'20px',
				'border-color':'white'
			};
	$scope.selection = function(selectedDevice){
		$scope.selectedDevice = selectedDevice;
		if(selectedDevice === 'desktop')
		{
			$scope.borderStyleDesktop = {
				'border-bottom':'none',
				'padding-bottom':'21px',
				'border-color':'white'
			};
			$scope.borderStyleLaptop = {
				'border-bottom':'solid 1px',
				'padding-bottom':'20px',
				'border-color':'white'
			};
;
		}
		else
		{
			$scope.borderStyleLaptop = {
				'border-bottom':'none',
				'padding-bottom':'21px',
				'border-color':'white'
			};
			$scope.borderStyleDesktop = {
				'border-bottom':'solid 1px',
				'padding-bottom':'20px',
				'border-color':'white'
			};
		}
	}
}])