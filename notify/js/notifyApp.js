angular.module("notifyApp",[]).controller("notifyController",["$http", "$scope", function($http, $scope){
	$scope.notify = {};
	$scope.emailid = "";
	$scope.notify.status = "";
	$scope.loading = false;
	$scope.sendEmail = function(){
		$scope.loading = true;
		$http({
			method:"POST",
			url:"/sendInfoMail",
			data:{emailid: $scope.emailid}
		}).then(function(response){
					$scope.notify.status = response.data.infoEmail;
					$scope.emailid = "";
					$scope.loading = false;
		})
	}
}])