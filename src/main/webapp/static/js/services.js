var serviceM= angular.module('servicesM', ['ngResource']);

serviceM.factory('ThetaService', function($resource){
    var webResource= {};
    
    webResource.core= $resource('/theta/ctrl/core/:action',{
        action: '@action'
    });
    webResource.message= $resource('/theta/ctrl/message/:action',{
        action: '@action'
    });
    webResource.complaint= $resource('/theta/ctrl/complaint/:action',{
        action: '@action'
    });

    // User
    webResource.user= $resource('/theta/ctrl/user/:action',{
        action: '@action'
    });    
    webResource.address= $resource('/theta/ctrl/user/address/:action',{
        action: '@action'
    });  
    webResource.basicDetail= $resource('/theta/ctrl/user/basicDetail/:action',{
        action: '@action'
    });  
    webResource.education= $resource('/theta/ctrl/user/education/:action',{
        action: '@action'
    });  
    webResource.idDetail= $resource('/theta/ctrl/user/idDetail/:action',{
        action: '@action'
    });
    webResource.occupation= $resource('/theta/ctrl/user/occupation/:action',{
        action: '@action'
    });
    return webResource;
});

serviceM.factory('ThetaGlobleDataService', function($resource){
    var ThetaGlobleDataService= {};
    return ThetaGlobleDataService;
});