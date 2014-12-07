'use strict';

angular.module('pvcloudApp').factory('accountService', function ($resource) {
    var baseURL = "/pvcloud_backend/";
    var accountResource = $resource(baseURL + "account_new.php?email=:email&nickname=:nickname&pwd=:pwd", {});

    function addNewAccount(email, nickname, pwd) {
        return accountResource.get({email: email, nickname: nickname, pwd: pwd});
    }

    return {
        AddNewAccount: addNewAccount
    };
});