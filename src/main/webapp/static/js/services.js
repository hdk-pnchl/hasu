var serviceM= angular.module('servicesM', ['ngResource']);

serviceM.factory('tbsService', function($resource){
    var webResource= {};
    
    webResource.core= $resource('/tbs/ctrl/core/:action',{
        action: '@action'
    });
    webResource.message= $resource('/tbs/ctrl/message/:action',{
        action: '@action'
    });
    webResource.complaint= $resource('/tbs/ctrl/complaint/:action',{
        action: '@action'
    });

    // User
    webResource.user= $resource('/tbs/ctrl/user/:action',{
        action: '@action'
    });    
    webResource.address= $resource('/tbs/ctrl/user/address/:action',{
        action: '@action'
    });  
    webResource.basicDetail= $resource('/tbs/ctrl/user/basicDetail/:action',{
        action: '@action'
    });  
    webResource.education= $resource('/tbs/ctrl/user/education/:action',{
        action: '@action'
    });  
    webResource.idDetail= $resource('/tbs/ctrl/user/idDetail/:action',{
        action: '@action'
    });
    webResource.occupation= $resource('/tbs/ctrl/user/occupation/:action',{
        action: '@action'
    });
    return webResource;
});

serviceM.factory('tbsGlobleDataService', function($resource){
    var tbsGlobleDataService= {};
    return tbsGlobleDataService;
});