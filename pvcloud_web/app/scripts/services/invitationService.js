'use strict';

/**
 * @ngdoc service
 * @name pvcloudApp.invitationService
 * @description
 * # invitationService to create and retrieve invitations
 * Factory in the pvcloudApp.
 */
angular.module('pvcloudApp').factory('InvitationService', function ($resource, UtilityService, $http) {
    var baseURL = UtilityService.GetBackendBaseURL();
    var inviteEnabledResource = $resource(baseURL + "invitation_enabled.php?account_id=:account_id&token=:token", {});     
    /**
     * Ajax call retrieve if invite a friend is available for an 
     * specific account
     */
    function getInviteEnabled(account_id, token){
        return inviteEnabledResource.get({account_id: account_id, token: token});        
    };
     function createInvitation(account_id, invitation, token) {
          return $http.post(baseURL + "invitation_add_post.php", 
            {   
                account_id: account_id,
                invitation:invitation,
                token: token
            });
    }
    return {
      SendFriendInvite: createInvitation,
      GetInviteEnabled: getInviteEnabled
    };
  });