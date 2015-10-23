'use strict';

angular.module('pvcloudApp').factory('sessionService', function ($resource, UtilityService) {

    var baseURL = UtilityService.GetBackendBaseURL();


    var sessionResource_Login = $resource(baseURL + "session_login.php?email=:email&pwd=:pwd", {});
    var sessionResource_Validate = $resource(baseURL + "session_validate.php?account_id=:account_id&token=:token", {});
    
    var sessionResource_Logout = $resource(baseURL + "session_logout.php?account_id=:account_id&token=:token", {});

    function setCurrentToken(token) {
        localStorage.setItem("token", token);
    }

    function setCurrentAccountID(account_id) {
        localStorage.setItem("account_id", account_id);
    }

    function getCurrentToken() {
        return localStorage.getItem("token");
    }

    function getCurrentAccountID() {
        return localStorage.getItem("account_id");
    }

    function setCurrentEmail(email) {
        localStorage.setItem("email", email);
    }

    function getCurrentEmail() {
        return localStorage.getItem("email");
    }

    function login(email, pwd) {
        return sessionResource_Login.get({email: email, pwd: pwd});
    }
       
    function logout(account_id, token){
        setCurrentAccountID(0);
        setCurrentEmail("");
        setCurrentToken("");
        
        console.log("LOGOUT WAS RRREALLLY CALLED HERE!!!");
        return sessionResource_Logout.get({account_id: account_id, token: token});        
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
        ValidateSession: validateSession,
        SetToken: setToken,
        GetCurrentEmail: getCurrentEmail,
        GetCurrentAccountID: getCurrentAccountID,
        GetCurrentToken: getCurrentToken,
        Login: login,
        Logout: logout
    };
});