'use strict';

angular.module('pvcloudApp').controller('MainCtrl', function ($scope, UtilityService, AccountService) {

    $scope.SwitchToPasswordRecoveryMode = switchToPWRecoveryMode;

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
