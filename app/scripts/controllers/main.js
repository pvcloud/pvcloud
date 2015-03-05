'use strict';

angular.module('pvcloudApp').controller('MainCtrl', function ($scope, $location, UtilityService, AccountService, sessionService) {

    console.log("InitatingModule")
    validateSession();

    $scope.SwitchToPasswordRecoveryMode = switchToPWRecoveryMode;
    
    if ($location.port() !== 9000) {
        if ($location.protocol() !== "https") {
            var currentURL = window.location.href;
            var newURL = currentURL.replace("http", "https").replace(":8080", "");
            window.location.href = newURL;
            return;
        }
    }    

    $scope.RecoverPassword_Click = function () {
        if (!$scope.Email)
            return;
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
    $scope.SwitchToNewAccountInfoMode = switchToNewAccountInfoMode;
    
    function validateSession() {
        sessionService.ValidateSession().$promise.then(function (response) {
            UtilityService.ProcessServiceResponse(response,
                    function success(response) {
                        $scope.LoggedIn = true;
                        $scope.Email = sessionService.GetCurrentEmail();
                        $scope.AccountID = sessionService.GetCurrentAccountID();
                        $location.path("/mycloud");
                    },
                    function error(response) {
                        $location.path("/");
                    },
                    function exception(response) {
                        alert("Disculpas por la interrupción. Ocurrió un problema con su sesión. Por favor trate autenticándose nuevamente.");
                        $location.path("/");
                    });
        });
    }  

    function fixLoginFormAction() {
        var actionURL = UtilityService.GetBackendBaseURL() + "post_account_login.php";
        console.log(actionURL);
        if (actionURL.indexOf("9000")) {
            document.getElementById("login_form").setAttribute("action", actionURL);
        }
    }


    function switchToPWRecoveryMode() {
        $("#recover_password_form").slideDown(100);
        $("#login_form").slideUp(100);
        $("#email").focus();
        $scope.FunctionMode = "RECOVER_PASSWORD";
    }

    function switchToLoginMode() {
        $("#recover_password_form").slideUp(100);
        $("#newAccountPanel").slideUp(100);
        $("#login_form").slideDown(100);
        $("#username").focus();
        $scope.FunctionMode = "LOGIN";
    }
    
    function switchToNewAccountInfoMode(){
        $("#login_form").slideUp(100, function(){
            $("#newAccountPanel").slideDown(1000);
        });

    }

    fixLoginFormAction();

});
