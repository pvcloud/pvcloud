'use strict';

angular.module('pvcloudApp').factory('AccountService', function ($resource, UtilityService) {
    var baseURL = UtilityService.GetBaseURL();
    var newAccountResource = $resource(baseURL + "account_new.php?email=:email&nickname=:nickname&pwd=:pwd", {});
    var accountChangePasswordResource = $resource(baseURL + "account_change_password.php?account_id=:account_id&token=:token" +
            "&old_password=:old_password&new_password=:new_password", {});

    var accountRequestPasswordRecoveryResource = $resource(baseURL + "account_recover_password.php?email=:email", {});    

    function addNewAccount(email, nickname, pwd) {
        return newAccountResource.get({email: email, nickname: nickname, pwd: pwd});
    }
    
    function changePassword(account_id, token, oldPassword, newPassword){
        return accountChangePasswordResource.get({
            account_id:account_id,
            token:token,
            old_password:oldPassword,
            new_password:newPassword
        });
    }
    function requestPasswordRecovery(email){
        return accountRequestPasswordRecoveryResource.get({
            email:email
        });
    }    

    return {
        AddNewAccount: addNewAccount,
        ChangePassword: changePassword,
        RequestPasswordRecovery: requestPasswordRecovery
    };
});