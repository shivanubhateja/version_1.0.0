var headModuleVar = angular.module("headModule");

headModuleVar.controller("homeController",['$scope',function($scope){
	// $scope.showw = false;
	$scope.selectedDevice = "laptop";
	$scope.borderStyleLaptop = {
				'border-bottom':'none',
				'padding-bottom':'21px',
				'border-color':'gray'
			};
	$scope.borderStyleDesktop =  {
				'border-bottom':'solid 1px',
				'padding-bottom':'20px',
				'border-color':'gray'
			};
	$scope.selection = function(selectedDevice){
		$scope.selectedDevice = selectedDevice;
		if(selectedDevice === 'desktop')
		{
			$scope.borderStyleDesktop = {
				'border-bottom':'none',
				'padding-bottom':'21px',
				'border-color':'gray'
			};
			$scope.borderStyleLaptop = {
				'border-bottom':'solid 1px',
				'padding-bottom':'20px',
				'border-color':'gray'
			};
;
		}
		else
		{
			$scope.borderStyleLaptop = {
				'border-bottom':'none',
				'padding-bottom':'21px',
				'border-color':'gray'
			};
			$scope.borderStyleDesktop = {
				'border-bottom':'solid 1px',
				'padding-bottom':'20px',
				'border-color':'gray'
			};
		}
	}
}])