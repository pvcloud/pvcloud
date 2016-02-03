'use strict';

/**
 * @ngdoc function
 * @name pvcloudApp.controller:MycloudInviteafriendCtrl
 * @description
 * # MycloudInviteafriendCtrl
 * Controller of the pvcloudApp
 */
angular.module('pvcloudApp').controller('_mycloud_inviteafriend', function ($scope, sessionService, InvitationService,UtilityService) {
    
    
    
    var protocol = window.location.protocol;
    //TODO: Making protocol for WGET to be HTTP until we find an easy way to install wget-ssl in Galileo
    //pvcloud_api.js driver will anyway interact ONLY with HTTPS

    protocol = "http:";
    var hostname = window.location.host;
    var port = window.location.port;

    var path = window.location.pathname;

    if (port === 9000) {  
        $scope.URLBegin = protocol + "//" + window.location.hostname + ":8080" + path;
    } else {
        $scope.URLBegin = protocol + "//" + hostname + path;
    }
    $scope.accountID = sessionService.GetCurrentAccountID();
    $scope.token = sessionService.GetCurrentToken();
    $scope.host_email = sessionService.GetCurrentEmail();
    $scope.SendInvitation = function(){
      var invitation ={
            host_email: $scope.host_email ,
            guest_email: $scope.guest_email            
      };
      var account_id = $scope.accountID;
      var token = $scope.token;
      createInvitation(account_id,invitation,token);
       
    };
    function createInvitation(account_id, invitation,token) {        
       
        InvitationService.SendFriendInvite(
                account_id,
                invitation,
                token
                ).then(function (response) {
            UtilityService.ProcessServiceResponse(response,
                    function success(response) {
                        var app = response.data;
                        $location.path("/apps");
                        alert("Los datos se almacenaron satisfactoriamente.");
                    },
                    function error(response) {
                        console.log(response);
                    },
                    function exception(response) {
                        console.log(response);
                    });
        });
}
 
  });
