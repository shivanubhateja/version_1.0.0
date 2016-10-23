var headModuleVar = angular.module("headModule");

headModuleVar.controller("accountActivationController",['$rootScope', '$location', function($rootScope, $location){
	console.log("ss")
			$rootScope.errorMessageNavBarSuccess = "Account successfully activated, please login to proceed";
			$rootScope.disableErrorBarSuccess();
			$location.url("/");
}])