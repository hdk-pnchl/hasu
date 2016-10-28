var thetaM= angular.module('thetaM', ['ngRoute','ngAnimate','controllersM','servicesM','directiveM','ui.bootstrap']);

thetaM.config(function($resourceProvider){});

thetaM.config(['$routeProvider', function($routeProvider){
	//Home
	$routeProvider.when('/home', {
		templateUrl: 'html/core/home_001.html',
		//templateUrl: 'html/core/home_002.html',
		//templateUrl: 'html/core/home_003.html',
		controller: 'HomeController'
	});

	//aboutUs
	$routeProvider.when('/aboutUs', {
		templateUrl: 'html/core/aboutUs_words.html',
		controller: 'AboutUsController'
	});

	//contactUs
	$routeProvider.when('/contactUs', {
		templateUrl: 'html/core/contactUs.html',
		controller: 'ContactUsController'
	});
	$routeProvider.when('/messages', {
		templateUrl: 'html/messages.html',
		controller: 'MessageController'
	});

	//singIn
	$routeProvider.when('/signIn', {
		templateUrl: 'html/core/signIn_002.html',
		controller: 'SignInController'
	});
	$routeProvider.when('/signIn/:error', {
		templateUrl: 'html/core/signIn_002.html',
		controller: 'SignInController'
	});	

	//signUp
	$routeProvider.when('/signUp', {
		templateUrl: 'html/core/signUp_002.html',
		controller: 'SignUpController'
	});

	//message
	$routeProvider.when('/message/list', {
		templateUrl: 'html/message/list.html',
		controller: 'MessageListController'
	});
	$routeProvider.when('/message/new', {
		templateUrl: 'html/message/message.html',
		controller: 'MessageController'
	});	
	$routeProvider.when('/message/update/:messageID', {
		templateUrl: 'html/message/message.html',
		controller: 'MessageController'
	});
	$routeProvider.when('/message/summary/:messageID', {
		templateUrl: 'html/message/summary.html',
		controller: 'MessageSummaryController'
	});
	
	//complaint
	$routeProvider.when('/complaint/list', {
		templateUrl: 'html/complaint/list.html',
		controller: 'ComplaintListController'
	});
	$routeProvider.when('/complaint/new', {
		templateUrl: 'html/complaint/complaint.html',
		controller: 'ComplaintController'
	});	
	$routeProvider.when('/complaint/update/:complaintID', {
		templateUrl: 'html/complaint/complaint.html',
		controller: 'ComplaintController'
	});
	$routeProvider.when('/complaint/summary/:complaintID', {
		templateUrl: 'html/complaint/summary.html',
		controller: 'ComplaintSummaryController'
	});

	//user
	$routeProvider.when('/user/list', {
		templateUrl: 'html/user/list.html',
		controller: 'UserListController'
	});
	$routeProvider.when('/user', {
		templateUrl: 'html/user/user.html',
		controller: 'UserController'
	});		
	$routeProvider.when('/user/new', {
		templateUrl: 'html/user/user.html',
		controller: 'UserController'
	});	
	$routeProvider.when('/user/update/:userID', {
		templateUrl: 'html/user/user.html',
		controller: 'UserController'
	});
	$routeProvider.when('/user/summary/:userID', {
		templateUrl: 'html/user/summary.html',
		controller: 'UserSummaryController'
	});

	//password
	$routeProvider.when('/user/changePassword', {
		templateUrl: 'html/user/password/changePassword.html',
		controller: 'ChangePasswordController'
	});
	$routeProvider.when('/user/forgotPassword', {
		templateUrl: 'html/user/password/forgotPassword.html',
		controller: 'ChangePasswordController'
	});
	$routeProvider.when('/user/updateForgottenPassword/:token', {
		templateUrl: 'html/user/password/updateForgottenPassword.html',
		controller: 'ChangePasswordController'
	});

	//otherwise
	$routeProvider.otherwise({
		redirectTo: '/home'
	});	
}]);

thetaM.config(['$locationProvider', function($locationProvider){}]);


