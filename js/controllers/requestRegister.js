
var headModuleVar = angular.module("headModule");

headModuleVar.controller('requestController',["$rootScope","$scope","$http","$location",function($rootScope,$scope,$http,$location){
$rootScope.homePage = false;
	window.scroll(0,0);
			$scope.deviceDetails = {
			deviceType :(localStorage.getItem("deviceTypeLocal") !=null)? (localStorage.getItem("deviceTypeLocal")): '',
			serviceType :(localStorage.getItem("serviceTypeLocal") !=null)? (localStorage.getItem("serviceTypeLocal")): '',
			issueDesc:'',
			address : {
				initialAddress:'',
				city:'',
				state:'',
				zipCode:''
			},
			tel:{
				primary:'',
			},
			email:$rootScope.loggedIn? $rootScope.userEmail : ""
		}
		$scope.deviceDetails.address.city = "Coimbatore";
		$scope.deviceDetails.address.state = "Tamil Nadu";
		$scope.checkAvailabilityWhileBooking = {};
		$scope.checkAvailabilityWhileBooking.isAvailable = true;
		$scope.deviceList=["Desktop","Laptop"];
		$scope.serviceTypes = ["Pick Up","On-Site Repair"];
		
		$scope.selectDevice = function(device){

			$scope.deviceDetails.deviceType = device;
			localStorage.setItem("deviceTypeLocal",device)
		}
		$scope.serviceType = function(option){
			$scope.deviceDetails.serviceType = option;
			localStorage.setItem("serviceTypeLocal",option)
		}

		$scope.submitRequest = function(){
			$scope.deviceDetails.tel.primary = $scope.deviceDetails.tel.primary.replace('-', '');
			$scope.deviceDetails.tel.primary = $scope.deviceDetails.tel.primary.replace(' ', '');

			$http({
  			method: 'POST',
  			url: '/submitRequest',
  			data: {deviceDetails : $scope.deviceDetails}
			}).then(function successCallback(response) {
				if(response.data.response == "requestSubmitted")
				{
						$location.url('/bookingDone')
						localStorage.removeItem("deviceTypeLocal");
						localStorage.removeItem("serviceTypeLocal");
				}
				else
				{
					alert(JSON.stringify(response));
				}
			}, function errorCallback(response) {
			    // called asynchronously if an error occurs
 			   // or server returns response with an error status.
			  });
	    }
	$scope.checkAvailability = function(){
		$scope.checkAvailabilityWhileBooking.isAvailable = true;
		$scope.checkAvailabilityWhileBooking.showInvalidPin = true;
		if(($scope.deviceDetails.address.zipCode+"").length === 6){
		$http({
			method: 'GET',
			url: '/checkAvailability?location='+$scope.deviceDetails.address.zipCode
			}).then(function successCallback(response){
			if(response.data.response === true){
				$scope.checkAvailabilityWhileBooking.isAvailable = true;
				$scope.checkAvailabilityWhileBooking.showInvalidPin = false;
			}
			else{
				$scope.checkAvailabilityWhileBooking.isAvailable = false;	
				$scope.checkAvailabilityWhileBooking.showInvalidPin = false;
			}
		}, function failureCallback(){
		})

		}
	}
}]);