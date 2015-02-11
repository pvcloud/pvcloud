'use strict';

angular.module('pvcloudApp').factory('sessionService', function ($resource, UtilityService) {


    var baseURL = UtilityService.GetBackendBaseURL();


    var sessionResource_Create = $resource(baseURL + "account_authenticate.php?email=:email&pwd=:pwd", {});
    var sessionResource_Validate = $resource(baseURL + "session_validate.php?account_id=:account_id&token=:token", {});


    function setCurrentToken(token) {
        sessionStorage.setItem("token", token);
    }

    function setCurrentAccountID(account_id) {
        sessionStorage.setItem("account_id", account_id);
    }

    function getCurrentToken() {
        return sessionStorage.getItem("token");
    }

    function getCurrentAccountID() {
        return sessionStorage.getItem("account_id");
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
    
    function logout(){
        setCurrentAccountID(0);
        setCurrentEmail("");
        setCurrentToken("");
    }

    function validateSession() {
        console.log("VALIDATE SESSION");
        return sessionResource_Validate.get({account_id: getCurrentAccountID(), token: getCurrentToken()});
    }

    function setToken(tokenToSet, emailToSet, account_id) {
        setCurrentToken(tokenToSet);
        setCurrentEmail(emailToSet);
        setCurrentAccountID(account_id);
    }

    return {
        Authenticate: authenticate,
        ValidateSession: validateSession,
        SetToken: setToken,
        GetCurrentEmail: getCurrentEmail,
        GetCurrentAccountID: getCurrentAccountID,
        GetCurrentToken: getCurrentToken,
        Logout:logout
    };
});