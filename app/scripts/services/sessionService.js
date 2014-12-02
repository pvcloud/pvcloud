'use strict';

angular.module('pvcloudApp').factory('sessionService', function ($resource) {
    var baseURL = "/pvcloud_backend/";

    var sessionResource_Create = $resource(baseURL + "account_authenticate.php?email=:email&pwd=:pwd", {});
    var sessionResource_Validate = $resource(baseURL + "session_validate.php?email=:email&token=:token", {});


    function setCurrentToken(token) {
        sessionStorage.setItem("token", token);
    }

    function getCurrentToken() {
        return sessionStorage.getItem("token");
    }

    function setCurrentEmail(email) {
        sessionStorage.setItem("email", email);
    }

    function getCurrentEmail() {
        return sessionStorage.getItem("email");
    }

    function authenticate(email, pwd) {
        return sessionResource_Create.get({email: email, pwd: pwd});
    }

    function validateSession() {
        console.log("VALIDATE SESSION");
        return sessionResource_Validate.get({email: getCurrentEmail(), token: getCurrentToken()});
    }

    function setToken(tokenToSet, emailToSet) {
        setCurrentToken(tokenToSet);
        setCurrentEmail(emailToSet);
    }

    return {
        Authenticate: authenticate,
        ValidateSession: validateSession,
        SetToken: setToken
    };
});