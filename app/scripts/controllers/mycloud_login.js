'use strict';

angular.module('pvcloudApp').controller('MyCloud_LoginCtrl', function ($scope, AccountService, sessionService, $location, UtilityService, $routeParams) {
    $scope.AllGood = false;
    $scope.LoginIn = false;
    $scope.$parent.ActiveView = "mycloud";

    $scope.FunctionMode = "LOGIN"; //LOGIN or RECOVER_PASSWORD
    $scope.Email = "";
    $scope.Nickname = "";
    $scope.Pwd = "";
    $scope.ErrorMessages = [];
    $scope.LoggedIn = false;
    
    $scope.GenerateCapchaCase = generateCapchaCase;

    $scope.RecoverPassword_Click = function () {
        if(!$scope.Email || $scope.CapchaResponse != $scope.CapchaCase.Result) return;
        var email = $scope.Email;
        AccountService.RequestPasswordRecovery(email);
        alert("Un mensaje con instrucciones para recuperar su clave se enviará a su cuenta de correo electrónico. Gracias!");
        $scope.SwitchToLoginMode();
    };

    $scope.EnterKeyBehavior = function (event) {
        if (event.charCode === 13) {
            switch ($scope.FunctionMode) {
                case "RECOVER_PASSWORD":
                    $scope.RecoverPassword_Click();
                    break;
            }
        }
    };

    $scope.SwitchToPasswordRecoveryMode = switchToPWRecoveryMode;

    $scope.SwitchToLoginMode = switchToLoginMode;

    //INITIALIZATION CODE
    generateCapchaCase();

    if ($location.port() !== 9000) {
        if ($location.protocol() !== "https") {
            var currentURL = window.location.href;
            var newURL = currentURL.replace("http", "https").replace(":8080", "");
            window.location.href = newURL;
            return;
        }
    }

    //FIX FORM ACTION ON 9000 PORT
    var actionURL = UtilityService.GetBackendBaseURL() + "post_account_login.php";
    if (actionURL.indexOf("9000")) {
        document.getElementById("login_form").setAttribute("action", actionURL);
    }

    // PROCESS LOGIN ERROR IF ANY  
    if($routeParams.error_code){
        $scope.ErrorMessages=["El proceso de autenticación falló. Verifique por favor sus credenciales."];
    }
    //PROCESS AUTHENTICATION SUCESS
    if ($routeParams.account_id > 0 && $routeParams.token !== "" && $routeParams.token !== undefined) {
        $scope.LoginIn = true;
        var token = $routeParams.token;
        var account_id = $routeParams.account_id;
        var email = $routeParams.email;
        sessionService.SetToken(token, email, account_id);
        $location.path("mycloud");
        return;
    }

    $scope.AllGood = true;
    $("#username").focus();

    //PRIVATE VARIABLES

    function generateCapchaCase() {
        var num1 = Math.floor((Math.random() * 10) + 1);
        var num2 = Math.floor((Math.random() * 10) + 1);
        var oper = Math.floor((Math.random() * 3) + 1);
        var result = 0;
        var message = "";
        switch (oper) {
            case 1: //+
                result = num1 + num2;
                message = "El resultado de la suma entre " + num1 + " y " + num2 + " debería ser:";
                break;
            case 2: //-
                if (num1 > num2) {
                    result = num1 - num2;
                    message = "El resultado de la resta (" + num1 + " - " + num2 + ") debería ser:";
                } else {
                    result = num2 - num1;
                    message = "El resultado de la resta (" + num2 + " - " + num1 + ") debería ser:";
                }

                break;
            case 3:
                result = num1 * num2;
                message = "El resultado de la multiplicación (" + num1 + " * " + num2 + ") debería ser:";
                break;
        }


        $scope.CapchaCase = {
            Message: message,
            Result: result
        };
        $scope.CapchaResponse = "";
    }

    function switchToLoginMode() {
        $("#recover_password_form").slideUp(100);
        $("#login_form").slideDown(100);
        $("#username").focus();
        $scope.FunctionMode = "LOGIN";
    }

    function switchToPWRecoveryMode() {
        $("#recover_password_form").slideDown(100);
        $("#login_form").slideUp(100);
        $("#email").focus();
        generateCapchaCase();
        $scope.FunctionMode = "RECOVER_PASSWORD";
    }
});
