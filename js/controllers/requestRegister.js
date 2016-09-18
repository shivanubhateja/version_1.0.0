
var headModuleVar = angular.module("headModule");

headModuleVar.controller('requestController',["$rootScope","$scope","$http","$location",function($rootScope,$scope,$http,$location){

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
			email:''
		}

		
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
	
	

}]);