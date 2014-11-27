'use strict';

angular.module('pvcloudApp').factory('sessionService', function ($resource) {
    var baseURL = "/pvcloud_backend/";
    
    var sessionResource_Create = $resource(baseURL + "account_authenticate.php?email=:email&pwd=:pwd", {});
    var sessionResource_Validate = $resource(baseURL + "session_validate.php?email=:email&token=:token", {});
    var currentToken = "";
    var currentEmail = "";
    
    function authenticate(email, pwd) {
        return sessionResource_Create.get({email: email, pwd: pwd});
    }
    
    function validateSession(){
        return sessionResource_Validate.get({email: currentEmail, token: currentToken});
    }
    
    function setToken(tokenToSet, emailToSet){
        currentToken = tokenToSet;
        currentEmail = emailToSet;
    }

    return {
        Authenticate: authenticate,
        ValidateSession: validateSession,
        SetToken: setToken
    };
});