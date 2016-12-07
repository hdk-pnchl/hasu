var tbsM= angular.module('tbsM', ['ngRoute','ngAnimate','controllersM','servicesM','directiveM','ui.bootstrap']);

tbsM.config(function($resourceProvider){});

tbsM.config(['$routeProvider', function($routeProvider){
	//Home
	$routeProvider.when('/home', {
		templateUrl: 'element/html/core/home.html',
		controller: 'HomeController'
	});

	//aboutUs
	$routeProvider.when('/aboutUs', {
		templateUrl: 'element/html/core/aboutUs.html',
		controller: 'AboutUsController'
	});

	//contactUs
	$routeProvider.when('/contactUs', {
		templateUrl: 'element/html/core/contactUs.html',
		controller: 'ContactUsController'
	});
	$routeProvider.when('/messages', {
		templateUrl: 'html/messages.html',
		controller: 'MessageController'
	});

	//singIn
	$routeProvider.when('/sign', {
		templateUrl: 'element/html/core/sign.html',
		controller: 'SignController'
	});
	$routeProvider.when('/sign/:error', {
		templateUrl: 'element/html/core/sign.html',
		controller: 'SignController'
	});

	//message
	$routeProvider.when('/message/list', {
		templateUrl: 'element/html/message/list.html',
		controller: 'MessageListController'
	});
	$routeProvider.when('/message/new', {
		templateUrl: 'element/html/message/message.html',
		controller: 'MessageController'
	});	
	$routeProvider.when('/message/update/:messageID', {
		templateUrl: 'element/html/message/message.html',
		controller: 'MessageController'
	});
	$routeProvider.when('/message/summary/:messageID', {
		templateUrl: 'element/html/message/summary.html',
		controller: 'MessageSummaryController'
	});
	
	//complaint
	$routeProvider.when('/complaint/list', {
		templateUrl: 'element/html/complaint/list.html',
		controller: 'ComplaintListController'
	});
	$routeProvider.when('/complaint/new', {
		templateUrl: 'element/html/complaint/complaint.html',
		controller: 'ComplaintController'
	});	
	$routeProvider.when('/complaint/update/:complaintID', {
		templateUrl: 'element/html/complaint/complaint.html',
		controller: 'ComplaintController'
	});
	$routeProvider.when('/complaint/summary/:complaintID', {
		templateUrl: 'element/html/complaint/summary.html',
		controller: 'ComplaintSummaryController'
	});

	//user
	$routeProvider.when('/user/list', {
		templateUrl: 'element/html/user/list.html',
		controller: 'UserListController'
	});
	$routeProvider.when('/user', {
		templateUrl: 'element/html/user/user.html',
		controller: 'UserController'
	});		
	$routeProvider.when('/user/new', {
		templateUrl: 'element/html/user/user.html',
		controller: 'UserController'
	});	
	$routeProvider.when('/user/update/:userID', {
		templateUrl: 'element/html/user/user.html',
		controller: 'UserController'
	});
	$routeProvider.when('/user/summary/:userID', {
		templateUrl: 'element/html/user/summary.html',
		controller: 'UserSummaryController'
	});

	//password
	$routeProvider.when('/user/changePassword', {
		templateUrl: 'element/html/user/password/changePassword.html',
		controller: 'ChangePasswordController'
	});
	$routeProvider.when('/user/forgotPassword', {
		templateUrl: 'element/html/user/password/forgotPassword.html',
		controller: 'ChangePasswordController'
	});
	$routeProvider.when('/user/updateForgottenPassword/:token', {
		templateUrl: 'element/html/user/password/updateForgottenPassword.html',
		controller: 'ChangePasswordController'
	});

	//otherwise
	$routeProvider.otherwise({
		redirectTo: '/home'
	});	
}]);

tbsM.config(['$locationProvider', function($locationProvider){}]);


tbsM.config(function($sceDelegateProvider) {
  $sceDelegateProvider.resourceUrlWhitelist(['**']);
});

