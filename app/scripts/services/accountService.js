'use strict';

angular.module('pvcloudApp').factory('AccountService', function ($resource, UtilityService) {
    var baseURL = UtilityService.GetBaseURL();
    var accountResource = $resource(baseURL + "account_new.php?email=:email&nickname=:nickname&pwd=:pwd", {});

    function addNewAccount(email, nickname, pwd) {
        return accountResource.get({email: email, nickname: nickname, pwd: pwd});
    }

    return {
        AddNewAccount: addNewAccount
    };
});