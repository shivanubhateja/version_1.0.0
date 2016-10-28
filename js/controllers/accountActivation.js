var headModuleVar = angular.module("headModule");

headModuleVar.controller("accountActivationController",['$rootScope', '$location', function($rootScope, $location){
			$rootScope.errorMessageNavBarSuccess = "Account successfully activated, please login to proceed";
			$rootScope.disableErrorBarSuccess();
			$location.url("/");
}])