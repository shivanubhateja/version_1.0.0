angular.module("adminApp",['ngCookies']).controller('AdminController',["$scope","$http", "$cookies", "$rootScope",function($scope, $http, $cookies ,$rootScope){
	$scope.fetchPendingRequests = function(){
		$http({
			method: "GET",
			url: "/getServiceRequests "
		}).then(function successCallback(response){
			$scope.requests.activeRequests = response.data.active;
			$scope.requests.completedRequests = response.data.completed;

			console.log($scope.requests.completedRequests)
			$scope.requests.completedRequests.forEach(function(request, index){
				$scope.requests.completedRequests[index].date =  request.date.substr(0,10);
			})

			$scope.requests.activeRequests.forEach(function(request, index){
				$scope.requests.activeRequests[index].date =  request.date.substr(0,10);
			})
		},
		function failCallback(response){

		})
	}
	$rootScope.homePage = false;
	
	$scope.adminDetails = {};
	$scope.loginResponse = {};
	$scope.adminDetails.userName = "";
	$scope.adminDetails.password = "";
	if($cookies.getObject('adminLoggedInCookie') === true){
		$scope.adminLoggedIn = true;
		$scope.fetchPendingRequests();
	}
	else
		$scope.adminLoggedIn = false;
	$scope.loginResponse.message = '';
	$scope.requests = {}
	$scope.statusObject = {};
	$scope.statusObject.statusToChange = [];
	$scope.feedback = {};
	$scope.feedback.showPage = false;
	$scope.adminLoginCheck = function(){
		$http({
  			method: 'POST',
  			url: '/adminLoginRequest',
  			data: {username : $scope.adminDetails.userName , password : $scope.adminDetails.password}
			}).then(function successCallback(response) {
				if(response.data.loginSuccess == true){
					$cookies.putObject("adminLoggedInCookie", true);
					$scope.adminLoggedIn = true;
					$scope.fetchPendingRequests();
				}
				else{
					$cookies.putObject("adminLoggedInCookie", false);
					$scope.adminLoggedIn = false;
					$scope.loginResponse.message = response.data.message;
				}
			},
			function failCallback(response){
					$cookies.putObject("adminLoggedIn", false);
					$scope.adminLoggedIn = false;
					$scope.loginResponse.message = response.data.message;
			})
	}
	$scope.changeStatusFromActiveRequest = function(index,user){
		$http({
			method: "GET",
			url: "/updateStatus?user="+user+"&status="+$scope.statusObject.statusToChange[index]
		}).then(function successCallback(response){
			console.log(response.data)
			$scope.fetchPendingRequests();
		}, function failCallback(){

		})
	}
	$scope.adminLogout = function(){
		$scope.adminLoggedIn = !$scope.adminLoggedIn;
		$cookies.remove('adminLoggedInCookie')
	}
	$scope.addFeedbackButton = function(index,orderId, email){
		$scope.feedback.showPage = true;
		$scope.feedback.orderid = orderId;
		$scope.feedback.email = email;
		// console.log($scope.feedback.selection)
	}
	$scope.feedback.sendFeedback = function(){
		// $scope.feedback.showPage = true;
		$scope.feedback.service = $("input[name=service]:checked").val();
		$scope.feedback.custome_care = $("input[name=custome_care]:checked").val();
		$scope.feedback.delivery_time = $("input[name=delivery_time]:checked").val();
		$scope.feedback.website = $("input[name=website]:checked").val();
		$scope.feedback.recommend = $("input[name=recommend]:checked").val();
		$scope.feedback.overall = $("input[name=overall]:checked").val();
		// $scope.feedback.suggestions;
		$http({
			method:"GET",
			url:"addFeedback?email="+$scope.feedback.email+"&orderid="+$scope.feedback.orderid+"&service="+$scope.feedback.service+"&custome_care="+$scope.feedback.custome_care+"&delivery_time="+$scope.feedback.delivery_time+"&website="+$scope.feedback.website+"&recommend="+$scope.feedback.recommend+"&overall="+$scope.feedback.overall+"&suggestions="+$scope.feedback.suggestions
		}).then(function(response){
			$scope.feedback.showPage = false;
		$scope.feedback.orderid ;
		$scope.feedback.email = "";
		$scope.feedback.service ="";
		$scope.feedback.custome_care = "";
		$scope.feedback.delivery_time = "";
		$scope.feedback.website = "";
		$scope.feedback.recommend = "";
		$scope.feedback.overall = '';
		$scope.feedback.suggestions = '';
		})
	}

}]);