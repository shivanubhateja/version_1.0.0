angular.module("pincodeApp",[]).controller("pinController", ["$scope", "$http", function($scope, $http){
	$scope.pin = {};
	$scope.pin.display="";
	$scope.pin.displayrem="";
	$scope.addPin = function(){
		$http({
			method: "GET",
			url: "/addCode?pin="+$scope.pin.code
		}).then(function success(){
			$scope.pin.display= $scope.pin.code;
			$scope.pin.code = "";
			allCodes();
		}, function failure(){

		});
	}
	$scope.delPin = function(){
		$http({
			method: "GET",
			url: "/delCode?pin="+$scope.pin.codeRemove
		}).then(function success(){
			$scope.pin.displayrem= $scope.pin.codeRemove;
			$scope.pin.codeRemove = "";
			allCodes();
		}, function failure(){

		});
	}

	allCodes = function(){
		$http({
			method: "GET",
			url: "/getallcodes"
		}).then(function succ(response){
			console.log(response)
			$scope.pin.allCodes = response.data.response;
		}, function failed(){

		})
	}
	allCodes();
}])