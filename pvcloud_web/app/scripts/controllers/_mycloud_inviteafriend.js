'use strict';

/**
 * @ngdoc function
 * @name pvcloudApp.controller:MycloudInviteafriendCtrl
 * @description
 * # MycloudInviteafriendCtrl
 * Controller of the pvcloudApp
 */
angular.module('pvcloudApp').controller('_mycloud_inviteafriend', function ($scope, sessionService, InvitationService) {
    
    $scope.SelectedAccountID = sessionService.GetCurrentAccountID();
    
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
  });
