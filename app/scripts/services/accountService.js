'use strict';

/**
 * @ngdoc service
 * @name pvcloudApp.account
 * @description
 * # account
 * Factory in the pvcloudApp.
 */
angular.module('pvcloudApp').factory('accountService', function ($resource) {
    var baseURL = "/pvcloud_backend/";
    var accountResource = $resource(baseURL + "new_account.php?email=:email&nickname=:nickname&pwdHash=:pwdHash", {});

    function addNewAccount(email, nickname, pwdHash) {
        return accountResource.get({email: email, nickname: nickname, pwdHash: pwdHash});
    }

    return {
        AddNewAccount: addNewAccount
    };
});