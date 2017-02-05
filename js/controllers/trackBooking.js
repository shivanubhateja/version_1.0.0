var headModuleVar = angular.module("headModule");

headModuleVar.controller('trackBookingController',['$scope', '$rootScope', '$routeParams',function($scope, $rootScope, $routeParams){
	$scope.$parent.orderStatus.orderNumber = $routeParams.bookingId;
	$scope.$parent.orderStatus.getOrderStatus();
	$scope.$watch("modalContent", function(newValue, oldValue){
		$scope.trackingPage = true;
		$scope.trackBookingDetails = _.clone($rootScope.modalContent);
	})
}])
	