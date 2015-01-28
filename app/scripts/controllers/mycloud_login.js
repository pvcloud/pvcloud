'use strict';

angular.module('pvcloudApp').controller('MyCloud_LoginCtrl', function ($scope, AccountService, sessionService, $location, UtilityService, $routeParams) {
    $scope.AllGood = false;
    if ($location.port() !== "9000") {
        if ($location.protocol() !== "https") {
            var currentURL = window.location.href;
            var newURL = currentURL.replace("http", "https").replace(":8080", "");
            window.location.href = newURL;
            return;
        } else {
            $scope.AllGood = true;
        }
    }
   
    //PROCESS AUTHENTICATION SUCESS
    if($routeParams.account_id>0 && $routeParams.token !== "" && $routeParams.token !== undefined){
        var token = $routeParams.token;
        var account_id = $routeParams.account_id;
        var email = $routeParams.email;
        sessionService.SetToken(token, email, account_id);
        $location.path("mycloud");
        return;
    }
    

    $scope.$parent.ActiveView = "mycloud";
    $scope.FunctionMode = "LOGIN";//LOGIN or RECOVER_PASSWORD or NEW_ACCOUNT
    $scope.Email = "";
    $scope.Nickname = "";
    $scope.Pwd = "";
    $scope.Pwd2 = "";
    $scope.ErrorMessages = [];
    $scope.LoggedIn = false;
    generateCapchaCase();
    $scope.GenerateCapchaCase = generateCapchaCase;

    function hideAddonActions(whatsNext) {
        $(".pv-credentials-actions").slideUp(200, whatsNext);
    }

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

    $scope.CheckFields_AddAccount = function () {
        $scope.ErrorMessages = [];
        if (!$scope.Email) {
            $scope.ErrorMessages.push("El campo Email es inválido");
        }

        if (!$scope.Pwd) {
            $scope.ErrorMessages.push("El campo Password está vacío");
        } else if ($scope.Pwd != $scope.Pwd2) {
            $scope.ErrorMessages.push("Los campos de Password no coinciden");
        }
    };

    $scope.RegisterAccount = function () {
        $scope.CheckFields_AddAccount();
        if ($scope.ErrorMessages.length == 0) {
            AccountService.AddNewAccount($scope.Email, $scope.Nickname, $scope.Pwd).$promise.then(
                    function (response) {
                        $scope.ErrorMessages = [];
                        UtilityService.ProcessServiceResponse(response, function () {
                            $location.path("account_add_complete");
                        });
                    },
                    function (response) {
                        $scope.ErrorMessages = ["En este momento no podemos crear su cuenta. Por favor intente nuevamente en unos minutos."];
                    });
        }
    };

    $scope.RecoverPassword_Click = function () {
        var email = $scope.Email;
        AccountService.RequestPasswordRecovery(email);
        alert("Un mensaje con instrucciones para recuperar su clave se enviará a su cuenta de correo electrónico. Gracias!");
        $scope.SwitchToLoginMode();
    };

    $scope.EnterKeyBehavior = function (event) {
        if (event.charCode === 13) {

            switch ($scope.FunctionMode) {
                case "LOGIN":
                    $scope.Login();
                    break;
                case "RECOVER_PASSWORD":
                    $scope.RecoverPassword_Click();
                    break;
                case "NEW_ACCOUNT":
                    break;
            }

        }
    };

    $scope.Login = function () {
        $scope.ErrorMessages = [];
        sessionService.Authenticate($scope.Email, $scope.Pwd).$promise.then(function (response) {
            UtilityService.ProcessServiceResponse(response,
                    function success(response) {
                        var token = response.data.token;
                        var account_id = response.data.account_id;
                        sessionService.SetToken(token, $scope.Email, account_id);
                        $location.path("mycloud");
                    },
                    function error(response) {
                        console.log("ERROR");
                        $scope.ErrorMessages.push(response.message);
                        console.log($scope.ErrorMessages);
                    },
                    function exception(response) {
                        console.log("EXCEPTION");
                        $scope.ErrorMessages.push("Ocurrió un error en el servidor. Por favor intente de nuevo más tarde.");
                    });
        });
    };

    function showAddonActions() {
        $(".pv-credentials-actions").fadeIn(200);
    }

    $scope.SwitchToRegistrationMode = function () {
        $scope.FunctionMode = "NEW_ACCOUNT";//LOGIN or RECOVER_PASSWORD or NEW_ACCOUNT    
        $scope.ErrorMessages = [];
        hideAddonActions(function () {
            $("#pv-header-password-recovery").slideUp(100);
            $("#pv-header-credentials").slideUp(100);
            $(".pv-control-register-link").slideUp(100);
            $(".pv-control-login").slideUp(100);
            $(".pv-control-recover-password").slideUp(100, function () {
                $(".pv-control-back-to-login-separator").slideDown(100);
                $(".pv-control-recover-password-link").slideDown(100);
                $("#pv-header-registration").slideDown(100);
                $(".pv-control-register").slideDown(100);
                $(".pv-control-back-to-login-link").slideDown(100);
                $(".pv-input-password2").slideDown(100, function () {
                    showAddonActions();
                });
            });
        });
    };

    $scope.SwitchToPasswordRecoveryMode = function () {
        $scope.FunctionMode = "RECOVER_PASSWORD";//LOGIN or RECOVER_PASSWORD or NEW_ACCOUNT 
        $scope.ErrorMessages = [];
        generateCapchaCase();

        hideAddonActions(function () {
            $(".pv-control-back-to-login-separator").slideUp(100);
            $(".pv-control-register").slideUp(100);
            $("#pv-header-registration").slideUp(100);
            $("#pv-header-credentials").slideUp(100);
            $(".pv-control-login").slideUp(100);
            $(".pv-input-password").slideUp(100);
            $(".pv-input-password2").slideUp(100);
            $(".pv-control-recover-password-link").slideUp(100, function () {
                $(".pv-control-register-link").slideDown(100);
                $("#pv-header-password-recovery").slideDown(100);
                $(".pv-control-recover-password").slideDown(100);
                $(".pv-control-back-to-login-link").slideDown(100, showAddonActions);
            });
        });
    };

    $scope.SwitchToLoginMode = function () {
        $scope.FunctionMode = "LOGIN";//LOGIN or RECOVER_PASSWORD or NEW_ACCOUNT 
        $scope.ErrorMessages = [];
        hideAddonActions(function () {
            $(".pv-control-back-to-login-separator, #pv-header-registration,#pv-header-password-recovery, .pv-control-recover-password, .pv-control-back-to-login-link, .pv-control-register, .pv-input-password2 ").slideUp(200, function () {
                $(".pv-control-recover-password-link,.pv-input-password, .pv-control-login, .pv-control-register-link, #pv-header-credentials ").slideDown(200, showAddonActions);
            });
        });

    };

});
