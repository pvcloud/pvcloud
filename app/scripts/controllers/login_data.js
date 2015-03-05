'use strict';

angular.module('pvcloudApp').controller('LoginCtrl', function ($scope, $location, $routeParams, sessionService) {
    console.log("LOGIN CONTROLLER");
    // PROCESS LOGIN ERROR IF ANY  
    if ($routeParams.error_code) {
        console.log("LOGIN CONTROLLER - ERROR");
        console.log($routeParams.error_code);
        $scope.ErrorMessages = ["El proceso de autenticación falló. Verifique por favor sus credenciales."];
        return;
    }
    
    //PROCESS AUTHENTICATION SUCESS
    if ($routeParams.account_id > 0 && $routeParams.token !== "" && $routeParams.token !== undefined) {
        console.log("LOGIN CONTROLLER - SUCCESS");
        $scope.LoginIn = true;
        var token = $routeParams.token;
        var account_id = $routeParams.account_id;
        var email = $routeParams.email;
        sessionService.SetToken(token, email, account_id);
        $location.path("mycloud");
        return;
    }
});
