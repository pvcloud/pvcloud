'use strict';

/**
 * @ngdoc service
 * @name pvcloudApp.invitationService
 * @description
 * # invitationService to create and retrieve invitations
 * Factory in the pvcloudApp.
 */
angular.module('pvcloudApp').factory('invitationService', function ($resource, UtilityService) {
    var baseURL = UtilityService.GetBackendBaseURL();
    
    /**
     * Comment
     */
    function sendFriendInvite() {
        return $http.post(baseURL + "invitation_add_post.php");
    };
    
    return {
      SendFriendInvite: sendFriendInvite
    };
  });