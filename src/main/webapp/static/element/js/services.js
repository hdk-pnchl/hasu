var serviceM= angular.module('servicesM', ['ngResource']);

serviceM.factory('tbsService', function($resource){
    var webResource= {};
    var rootPath= 'http://localhost:8080/';
    //var rootPath= 'http://104.238.126.194:8080';
    
    webResource.core= $resource(rootPath+'/tbs/ctrl/core/:action',{
        action: '@action'
    });
    webResource.message= $resource(rootPath+'/tbs/ctrl/message/:action',{
        action: '@action'
    });
    webResource.complaint= $resource(rootPath+'/tbs/ctrl/complaint/:action',{
        action: '@action'
    });

    // User
    webResource.user= $resource(rootPath+'/tbs/ctrl/user/:action',{
        action: '@action'
    });    
    webResource.address= $resource(rootPath+'/tbs/ctrl/user/address/:action',{
        action: '@action'
    });  
    webResource.basicDetail= $resource(rootPath+'/tbs/ctrl/user/basicDetail/:action',{
        action: '@action'
    });  
    webResource.education= $resource(rootPath+'/tbs/ctrl/user/education/:action',{
        action: '@action'
    });  
    webResource.idDetail= $resource(rootPath+'/tbs/ctrl/user/idDetail/:action',{
        action: '@action'
    });
    webResource.occupation= $resource(rootPath+'/tbs/ctrl/user/occupation/:action',{
        action: '@action'
    });
    return webResource;
});

serviceM.factory('tbsGlobleDataService', function($resource){
    var tbsGlobleDataService= {};
    return tbsGlobleDataService;
});