var serviceM= angular.module('servicesM', ['ngResource']);

serviceM.factory('tbsService', function($resource){
    var webResource= {};
    
    webResource.rootPath= 'http://104.238.126.194:8080/tbs';
    //webResource.rootPath= 'http://localhost:8080/tbs';

    webResource.core= $resource(webResource.rootPath+'/ctrl/core/:action',{
        action: '@action'
    });
    webResource.message= $resource(webResource.rootPath+'/ctrl/message/:action',{
        action: '@action'
    });
    webResource.complaint= $resource(webResource.rootPath+'/ctrl/complaint/:action',{
        action: '@action'
    });

    // User
    webResource.user= $resource(webResource.rootPath+'/ctrl/user/:action',{
        action: '@action'
    });    
    webResource.address= $resource(webResource.rootPath+'/ctrl/user/address/:action',{
        action: '@action'
    });  
    webResource.basicDetail= $resource(webResource.rootPath+'/ctrl/user/basicDetail/:action',{
        action: '@action'
    });  
    webResource.education= $resource(webResource.rootPath+'/ctrl/user/education/:action',{
        action: '@action'
    });  
    webResource.idDetail= $resource(webResource.rootPath+'/ctrl/user/idDetail/:action',{
        action: '@action'
    });
    webResource.occupation= $resource(webResource.rootPath+'/ctrl/user/occupation/:action',{
        action: '@action'
    });
    return webResource;
});

serviceM.factory('tbsGlobleDataService', function($resource){
    var tbsGlobleDataService= {};
    return tbsGlobleDataService;
});