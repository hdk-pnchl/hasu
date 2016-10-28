var controllersM= angular.module('controllersM', ['servicesM', 'ui.bootstrap']);

//------------------------------------CORE

controllersM.controller('CoreController', function($scope, $http, $location, $rootScope, ThetaService){
    ThetaService.core.get({
            action: "getBannerData"
        }, 
        function(response){
            $scope.bannerData= response;
            if($scope.bannerData.navData.configNavData.profile){
                $scope.bannerData.navData.configNavData.profile.title= $scope.bannerData.USER_DATA.basicDetail.name;
                $scope.bannerData.navData.configNavData.profile.subNav.user.path= $scope.bannerData.navData.configNavData.profile.subNav.user.path+"/update/"+$scope.bannerData.USER_DATA.id;                
            }
        }, 
        function(){ 
            alert('getBannerData failed');
        }
    );
    $scope.footerData= {};
    $rootScope.$on("$locationChangeSuccess", function(event, newUrl, oldUrl, newState, oldState){ 
        var xTabName= $location.path().split("/")[1];
        if(xTabName == 'home'){
            $scope.showHome= true;
        }else{
            $scope.showHome= false;
        }
    });
});

//------------------------------------BANNER

controllersM.controller('BannerController', function($scope, ThetaService){

});


//------------------------------------HOME

controllersM.controller('HomeController', function($scope){
});


//------------------------------------SING-UP

controllersM.controller('SignUpController', function($scope, $location, ThetaService){
    $scope.user= {};
    $scope.isEmailTaken= false;
    $scope.isPasswordMatching= true;
    $scope.signUp= function(){
        if($scope.user.basicDetail.password != $scope.user.basicDetail.confirmPassword){
            $scope.isPasswordMatching= false;
        }else{
            $scope.isPasswordMatching= true;
            //server call: check if email id not already taken
            ThetaService.core.save({
                    action: "isEmailIdTaken",
                    emailID: $scope.user.basicDetail.emailID
                },{},
                function(response){
                    if(response && response.isEmailIdTaken){
                        $scope.isEmailTaken= true;
                    }else{
                        $scope.isEmailTaken= false;
                        //server call: save user
                        ThetaService.core.save({
                            action: "signUp"
                        }, 
                        $scope.user, 
                        function(userDetail){
                           $location.path($scope.$parent.bannerData.navData.configNavData.signIn.path);
                        }, 
                        function(){
                            alert("User save failure");
                        });
                    }
                }, 
                function(){
                    alert("isEmailIdTaken call failed");
                }
            );
        }
    };
});

//------------------------------------SignIN

controllersM.controller('SignInController', function($scope, $route, $routeParams, $location){
    if($routeParams.error){
        alert("Please enter valid Credentials!");
    }
});

//------------------------------------ABOUT-US

controllersM.controller('AboutUsController', function ($scope) {});

//------------------------------------CONTACT-US

controllersM.controller('ContactUsController', function($scope, ThetaService){
    $scope.alerts= [];
    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };        
    $scope.submitMessage = function(message){ 
        $scope.alerts= [];
        if(message){
            if(!message.name){
                message.name= $scope.$parent.bannerData.USER_DATA.basicDetail.name;
            }
            if(!message.emailID){
                message.emailID= $scope.$parent.bannerData.USER_DATA.basicDetail.emailID;
            }   
            ThetaService.core.save({
                    action: "saveMessage"
                },
                message,
                function(persistedMessage){
                    $scope.message.message= "";
                    $scope.alerts.push({ 
                        type: "success", 
                        msg: "We got your message and shortly will get back to you on it"
                    });
                },
                function(){
                    alert("Message send failure");
                }
            );
        }else{
            $scope.alerts.push({
                type: "danger", 
                msg: "Please enter the Message."
            });
        }
    };
});

//------------------------------------MESSAGE

controllersM.controller('MessageListController', function($scope, ThetaService, $uibModal){
    ThetaService.message.query({
            action: "getColumnData"
        }, 
        function(response){
            $scope.messageGridtData= {};
            $scope.messageGridtData.columnData= response;

            var searchIp= {};
            searchIp.pageNo= 1;
            searchIp.rowsPerPage= 30;
            searchIp.searchData= {};

            $scope.fetchMessages(searchIp); 
        }, 
        function(){ 
            alert('Core geColumnData failed');
        }
    );
    $scope.editMessage = function(editRow){
        alert("Op not implemented!");
    };
    $scope.viewMessage = function(viewRow){ 
        $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'html/message/summary.html',
            controller: 'MessageSummaryController',
            size: 'lg',
            resolve:{
                messageID: function (){
                    return viewRow.id;
                }
            }
        });        
    };    
    $scope.deleteMessage = function(deleteRow){ 
        alert("Op not implemented!");
    };
    $scope.fetchMessages = function(searchIp){
        ThetaService.message.save({
                action: "listBySeach",
                searchIp: searchIp
            }, 
            searchIp, 
            function(response){
                $scope.messageGridtData.rowData= response.responseEntity;
                $scope.messageGridtData.totalRowCount= parseInt(response.responseData.ROW_COUNT);
                $scope.messageGridtData.currentPageNo= parseInt(response.responseData.CURRENT_PAGE_NO);
                $scope.messageGridtData.rowsPerPage= parseInt(response.responseData.ROWS_PER_PAGE);                
                $scope.messageGridtData.pageAry= new Array(parseInt(response.responseData.TOTAL_PAGE_COUNT));                
            },
            function(response){
                alert("Message listBySeach by ip failure");
            }
        );
    };
});

controllersM.controller('MessageController', function($scope, ThetaService, $routeParams){
    $scope.messageData= {};
    ThetaService.message.get({
        action: "getFormData"
    }, function(messageFormResp){
        $scope.messageData= messageFormResp;
        if($routeParams.messageID){
            ThetaService.message.get({
                action: "get",
                messageID: $routeParams.messageID
            }, function(messageResp){
                $scope.messageData.data= messageResp.responseEntity;
            }, function(){
                alert("Message get failure");
            });
        }
    }, function(){
        alert("getFormData get failure");
    });

    $scope.update = function(data){
        ThetaService.message.save({
            action: "update"
        }, 
        data,
        function(messageResp){
             alert("Message answered :)");
        }, function(){
            alert("Message save failure");
        });        
    };
});

controllersM.controller('MessageSummaryController', function($scope, ThetaService, messageID){
    $scope.messageDetail= {};
    if(messageID){
         ThetaService.message.get({
            action: "get",
            messageID: messageID
        }, function(messageDataResp){
            $scope.messageDetail= messageDataResp;
        }, function(){
            alert("Message get failure");
        });
    }
});

//------------------------------------COMPLAINT

controllersM.controller('ComplaintListController', function($scope, $location, $uibModal, ThetaService){ 
    ThetaService.complaint.query({
            action: "getColumnData"
        },
        function(response){
            $scope.complaintGridtData= {};
            $scope.complaintGridtData.columnData= response;

            var searchIp= {};
            searchIp.pageNo= 1;
            searchIp.rowsPerPage= 30;
            searchIp.searchData= {};

            $scope.fetchComplaints(searchIp); 
        },
        function(){
            alert('Core getColumnData failed');
        }
    );
    $scope.editComplaint = function(editRow){
        var summaryPath= '/addComplaint/'+editRow.complaintId;
        $location.path(summaryPath);
    };
    $scope.viewComplaint = function(viewRow){ 
        $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'html/complaintSummary.html',
            controller: 'ComplaintSummaryController',
            size: 'lg',
            resolve:{
                    complaintId: function (){
                    return viewRow.complaintId;
                }
            }
        });
    };
    $scope.deleteComplaint = function(deleteRow){ 
        alert("Delete not possible yet. Work in progress.");
    };
    
    $scope.fetchComplaints = function(searchIp){
        ThetaService.complaint.save({
                action: "listBySeach",
                searchIp: searchIp
            },
            searchIp,
            function(response){
                $scope.complaintGridtData.rowData= response.responseEntity;
                $scope.complaintGridtData.totalRowCount= parseInt(response.responseData.ROW_COUNT);
                $scope.complaintGridtData.currentPageNo= parseInt(response.responseData.CURRENT_PAGE_NO);
                $scope.complaintGridtData.rowsPerPage= parseInt(response.responseData.ROWS_PER_PAGE);
                $scope.complaintGridtData.pageAry= new Array(parseInt(response.responseData.TOTAL_PAGE_COUNT));
            },
            function(response){
                alert("Complaint getAllBySeach by IP failure");
            }
        );
    };
});

controllersM.controller('ComplaintFormController', function($scope, ThetaService, $routeParams){
    $scope.complaintData= {};
    ThetaService.complaint.get({
        action: "getFormData"
    }, function(complaintFormResp){
        $scope.complaintData= complaintFormResp;
        if($routeParams.complaintID){
            ThetaService.complaint.get({
                action: "get",
                complaintID: $routeParams.complaintID
            }, function(complaintResp){
                $scope.complaintData.data= complaintResp.responseEntity;
            }, function(){
                alert("Complaint get failure");
            });
        }
    }, function(){
        alert("getFormData get failure");
    });

    $scope.update = function(data){
        ThetaService.complaint.save({
            action: "update"
        }, 
        data,
        function(complaintResp){
            alert("Complaint updated :)");
        }, function(){
            alert("Complaint updated failure");
        });        
    };
});

controllersM.controller('ComplaintController', function($scope, $route, $routeParams, $location, $http, ThetaService){
    ThetaService.complaint.get({
            action: "getWizzardData"
        }, 
        function(response){
            $scope.complaintWizzard= response;
            $scope.complaintDetail= {};
            if($routeParams.complaintID){
                 ThetaService.complaint.get({
                    action: "get",
                    complaintID: $routeParams.complaintID
                }, function(complaintDataResp){
                    $scope.complaintDetail= complaintDataResp;
                    angular.forEach($scope.complaintWizzard.wizzardData, function(formIpData, formName){
                        formIpData.data= $scope.complaintDetail[formName];
                    });                
                }, function(){
                    alert("Complaint get failure");
                });          
            }else{
                angular.forEach($scope.complaintWizzard.wizzardData, function(formIpData, formName){
                    $scope.complaintDetail[formName]= {};
                    angular.forEach(formIpData.fieldAry, function(field){
                        $scope.complaintDetail[formName][field.name]= "";
                    });   
                    formIpData.data= $scope.complaintDetail[formName];
                });             
            }
            $scope.complaintDetail.isReady= true;
        }, 
        function(){ 
            alert('Complaint getWizzardData failure');
        }
    );  
 
    $scope.selectWizzardStep= function(selectedWizzardStep){
        angular.forEach($scope.complaintWizzard.wizzardStepData, function(wizzardStep){
            wizzardStep.active= false;
            wizzardStep.class= '';
        });    
        selectedWizzardStep.active= true;
        selectedWizzardStep.class= 'active';

        angular.forEach($scope.complaintWizzard.wizzardData, function(value, key){
            value.isHidden = true;
        });    
        $scope.complaintWizzard.wizzardData[selectedWizzardStep.name].isHidden=false;
    };
 
    $scope.isLastStep= function(step) {
       if(step == $scope.complaintWizzard.commonData.lastStep){
            return true;
       }
       return false;
    }

    $scope.submitComplaint = function(complaintDataType, complaintData){
        var service= ThetaService[complaintDataType];
        var action= "save";
        if($scope.complaintDetail[complaintDataType] && $scope.complaintDetail[complaintDataType].id){
            action= "update";
            complaintData["id"]= $scope.complaintDetail[complaintDataType]["id"];
        }
        //server call
        service.save({
                action: action,
                patientId: $scope.complaintDetail.id
            }, 
            complaintData, 
            function(persistedComplaintData){
                if(persistedComplaintData.responseData && persistedComplaintData.responseData.ERROR_MSG){
                    alert(persistedComplaintData.responseData.ERROR_MSG);
                }else{
                    $scope.complaintDetail= persistedComplaintData.responseEntity;
                    //if its last step, redirect to patient-grid
                    if($scope.isLastStep(complaintDataType)){
                        $location.path($scope.$parent.bannerdata.navData.mainNavData.complaint.subNav[0].path);
                    }else{
                        //mark current step as complete
                        var currentWizzardStep= $scope.complaintWizzard.wizzardStepData[complaintDataType];
                        currentWizzardStep.submitted= true;
                        //move to next step in the wizzard
                        $scope.selectWizzardStep($scope.complaintWizzard.wizzardStepData[currentWizzardStep.next]);
                    }
                }
            },
            function(){
                alert("Complaint save failure");
            }
        );
    };
});

controllersM.controller('ComplaintSummaryController', function($scope, ThetaService, complaintID){
    $scope.complaintDetail= {};
    if(complaintID){
         ThetaService.complaint.get({
            action: "get",
            complaintID: complaintID
        }, function(complaintDataResp){
            $scope.complaintDetail= complaintDataResp;
        }, function(){
            alert("Complaint get failure");
        });
    }
});

//------------------------------------USER

controllersM.controller('UserListController', function($scope, $location, $uibModal, ThetaService){ 
    ThetaService.user.query({
            action: "getColumnData"
        },
        function(response){
            $scope.userGridtData= {};
            $scope.userGridtData.columnData= response;

            var searchIp= {};
            searchIp.pageNo= 1;
            searchIp.rowsPerPage= 30;
            searchIp.searchData= {};

            $scope.fetchUsers(searchIp); 
        },
        function(){
            alert('Core getColumnData failed');
        }
    );
    $scope.editUser = function(editRow){
        var summaryPath= '/addUser/'+editRow.userID;
        $location.path(summaryPath);
    };
    $scope.viewUser = function(viewRow){ 
        $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'html/user/summary.html',
            controller: 'UserSummaryController',
            size: 'lg',
            resolve:{
                userID: function (){
                    return viewRow.userID;
                }
            }
        });
    };
    $scope.deleteUser = function(deleteRow){ 
        alert("Delete not possible yet. Work in progress.");
    };
    
    $scope.fetchUsers = function(searchIp){
        ThetaService.user.save({
                action: "listBySeach",
                searchIp: searchIp
            },
            searchIp,
            function(response){
                $scope.userGridtData.rowData= response.responseEntity;
                $scope.userGridtData.totalRowCount= parseInt(response.responseData.ROW_COUNT);
                $scope.userGridtData.currentPageNo= parseInt(response.responseData.CURRENT_PAGE_NO);
                $scope.userGridtData.rowsPerPage= parseInt(response.responseData.ROWS_PER_PAGE);
                $scope.userGridtData.pageAry= new Array(parseInt(response.responseData.TOTAL_PAGE_COUNT));
            },
            function(response){
                alert("User listBySeach failed");
            }
        );
    };
});

controllersM.controller('UserController', function($scope, ThetaService, $routeParams, $location){
    ThetaService.user.get({
            action: "getWizzardData"
        }, 
        function(response){
            $scope.userWizzard= response;
            $scope.userDetail= {};
            if($routeParams.userID){
                 ThetaService.user.get({
                    action: "get",
                    userID: $routeParams.userID
                }, function(userDataResp){
                    $scope.userDetail= userDataResp.responseEntity;
                    angular.forEach($scope.userWizzard.wizzardData, function(formIpData, formName){
                        formIpData.data= $scope.userDetail[formName];
                    });
                }, function(){
                    alert("User get failure");
                });
            }else{
                angular.forEach($scope.userWizzard.wizzardData, function(formIpData, formName){
                    $scope.userDetail[formName]= {};
                    angular.forEach(formIpData.fieldAry, function(field){
                        $scope.userDetail[formName][field.name]= "";
                    });
                    formIpData.data= $scope.userDetail[formName];
                });
            }
            $scope.userDetail.isReady= true;
        }, 
        function(){ 
            alert('User getWizzardData failure');
        }
    );  
 
    $scope.selectWizzardStep= function(selectedWizzardStep){
        angular.forEach($scope.userWizzard.wizzardStepData, function(wizzardStep){
            wizzardStep.active= false;
            wizzardStep.class= '';
        });    
        selectedWizzardStep.active= true;
        selectedWizzardStep.class= 'active';

        angular.forEach($scope.userWizzard.wizzardData, function(value, key){
            value.isHidden = true;
        });    
        $scope.userWizzard.wizzardData[selectedWizzardStep.name].isHidden=false;
    };
 
    $scope.isLastStep= function(step) {
       if(step == $scope.userWizzard.commonData.lastStep){
            return true;
       }
       return false;
    }

    $scope.submitUser = function(userDataType, userData){
        var service= ThetaService[userDataType];
        var action= "save";
        if($scope.userDetail[userDataType] && $scope.userDetail[userDataType].id){
            action= "update";
            userData["id"]= $scope.userDetail[userDataType]["id"];
        }
        //server call
        service.save({
                action: action,
                userID: $scope.userDetail.id
            }, 
            userData, 
            function(persistedUserData){
                if(persistedUserData.responseData && persistedUserData.responseData.ERROR_MSG){
                    alert(persistedUserData.responseData.ERROR_MSG);
                }else{
                    $scope.userDetail= persistedUserData.responseEntity;
                    if($scope.isLastStep(userDataType)){
                        alert("Thank you for sharing your information. Your information is safe with duel-encryption and only you who can see it. Now, go ahead any file a complain!");
                        //$location.path($scope.$parent.bannerData.navData.mainNavData.user.subNav[0].path);
                    }else{
                        //mark current step as complete
                        var currentWizzardStep= $scope.userWizzard.wizzardStepData[userDataType];
                        currentWizzardStep.submitted= true;
                        //move to next step in the wizzard
                        $scope.selectWizzardStep($scope.userWizzard.wizzardStepData[currentWizzardStep.next]);
                    }
                }
            },
            function(){
                alert("User save failure");
            }
        );
    };
});

controllersM.controller('UserSummaryController', function($scope, ThetaService, userID){
    $scope.userDetail= {};
    if(userID){
         ThetaService.user.get({
            action: "get",
            userID: userID
        }, function(userDataResp){
            $scope.userDetail= userDataResp;
        }, function(){
            alert("User get failure");
        });
    }
});

controllersM.controller('ChangePasswordController', function($scope, $location, $routeParams, ThetaService){
    $scope.pwData= {};
    $scope.updatePW= function(){
        if($scope.pwData.newPassword == $scope.pwData.repeatPassword){
            ThetaService.user.save({
                action: "updatePassword",
                newPassword: $scope.pwData.newPassword,
                currentPassword: $scope.pwData.currentPassword
            },{},
            function(response){
                var responseData= response.responseData;
                if(responseData && responseData.SUCCESS){
                    alert("Password is successfuly update. You will be logged-out now. Please Login again with new password.")
                    window.location = '/theta/logout';
                }else{
                    alert("We are sorry, password update filed. Please try again in sometime.!");
                }
            }, 
            function(){
                alert("updatePassword call failed");
            });
        }else{
            alert("Repeat-password does not match with New-password! Please make sure to enter both the password same.")
        }
    };

    $scope.forgotPW= function(){
        if($scope.pwData.emailID){
            ThetaService.core.save({
                action: "initiatePasswordUpdate",
                emailID: $scope.pwData.emailID,
            },{},
            function(response){
                var responseData= response.responseData;
                if(responseData && responseData.SUCCESS){
                    $scope.pwData.forgotPWLink= responseData.PW_UPDATE_URL;
                    alert("Password update link successfuly sent your registered email id.")
                }else if(responseData && responseData.ERR_USER_DOESNT_EXISTS){
                    alert("Afraid, there is no account associated with given Email ID. Please check the Email ID and try again.");
                }else{
                    alert("We are sorry, Forgot-password flow filed. Please try again in sometime.!");
                }
            }, 
            function(){
                alert("initiatePasswordUpdate call failed");
            });
        }else{
            alert("Please enter the Email ID.")
        }
    };

    $scope.updateForgottenPassword= function(){
        if($routeParams.token){
            if($scope.pwData.newPassword == $scope.pwData.repeatPassword){
                ThetaService.core.save({
                    action: "updateForgottenPassword",
                    token: $routeParams.token,
                    newPassword: $scope.pwData.newPassword
                },{},
                function(response){
                    var responseData= response.responseData;
                    if(responseData && responseData.SUCCESS){
                        alert("Password is successfuly update. Please login to your account with new password.")
                        $location.path($scope.$parent.bannerData.navData.configNavData.signIn.path);
                    }else{
                        alert("Update password link is faulty -No account associated against givem Email ID. Please re-initiate the forget password");
                    }
                }, 
                function(){
                    alert("updateForgottenPassword call failed");
                });
            }else{
                alert("Repeat-password does not match with New-password! Please make sure to enter both the password same.")
            }            
        }else{
            alert("Update password link is faulty. Please re-initiate the forget password");
        }
    };
});

//------------------------------------PROFILE

controllersM.controller('ProfileController', function($scope, $route, $routeParams, $location){

});