var headModuleVar = angular.module("headModule");

headModuleVar.controller('panelController',["$rootScope","$scope","$http","$location",function($rootScope,$scope,$http,$location){
	$rootScope.homePage = false;

	if(!$rootScope.loggedIn){
		$rootScope.errorMessageNavBar = "Login To Open Menu";
		$rootScope.disableErrorBar();
		$location.url("/");
	}
	else{
		$scope.contents=[
		{
			link:"request",
			heading:"GOT AN ISSUE...!!!",
			desc:"You are just a few clicks away in getting you PC working again. Register your request and let our experts handle rest of the hastle",
			image:"images/laptopRepair.png"
		},
		{
			link:"serviceRequests",
			heading:"My Service Requests",
			desc:"Get Details Of active as well as completed Service Requests.",
			image:"images/floppy.png"
		}
		];
		$rootScope.errorMessageNavBar = "";
		
		$scope.removeLocalData=function(){
			localStorage.removeItem("deviceTypeLocal");
		localStorage.removeItem("serviceTypeLocal");
		}

	}
}]);