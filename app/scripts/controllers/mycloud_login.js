'use strict';

/**
 * @ngdoc function
 * @name pvcloudApp.controller:MyCloudCtrl
 * @description
 * # MyCloudCtrl
 * Controller of the pvcloudApp
 */
angular.module('pvcloudApp').controller('MyCloud_LoginCtrl', function ($scope, AccountService, sessionService, $location, UtilityService) {
    $scope.$parent.ActiveView = "mycloud";
    $scope.Email = "";
    $scope.Nickname = "";
    $scope.Pwd = "";
    $scope.Pwd2 = "";
    $scope.ErrorMessages = [];
    $scope.LoggedIn = false;



    function hideAddonActions(whatsNext) {
        $(".pv-credentials-actions").slideUp(200, whatsNext);
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
                        processResponse(response, function () {
                            $location.path("account_add_complete");
                        });
                    },
                    function (response) {
                        $scope.ErrorMessages = ["En este momento no podemos crear su cuenta. Por favor intente nuevamente en unos minutos."];
                    });
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
        $scope.ErrorMessages = [];

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
        $scope.ErrorMessages = [];
        hideAddonActions(function () {
            $(".pv-control-back-to-login-separator, #pv-header-registration,#pv-header-password-recovery, .pv-control-recover-password, .pv-control-back-to-login-link, .pv-control-register, .pv-input-password2 ").slideUp(200, function () {
                $(".pv-control-recover-password-link,.pv-input-password, .pv-control-login, .pv-control-register-link, #pv-header-credentials ").slideDown(200, showAddonActions);
            });
        });

    };

});
