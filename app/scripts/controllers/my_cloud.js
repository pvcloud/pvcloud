'use strict';

/**
 * @ngdoc function
 * @name pvcloudApp.controller:MyCloudCtrl
 * @description
 * # MyCloudCtrl
 * Controller of the pvcloudApp
 */
angular.module('pvcloudApp')
        .controller('MyCloudCtrl', function ($scope) {

            function hideAddonActions(whatsNext) {
                $(".pv-credentials-actions").slideUp(200, whatsNext);
            }

            function showAddonActions() {
                $(".pv-credentials-actions").fadeIn(200);
            }
            
            $scope.$parent.ActiveView = "my_cloud";

            $scope.SwitchToRegistrationMode = function () {
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
                        $(".pv-input-password2").slideDown(100, function () {showAddonActions();});
                    });
                });
            };

            $scope.SwitchToPasswordRecoveryMode = function () {
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
                hideAddonActions(function () {
                    $(".pv-control-back-to-login-separator, #pv-header-registration,#pv-header-password-recovery, .pv-control-recover-password, .pv-control-back-to-login-link, .pv-control-register, .pv-input-password2 ").slideUp(200, function () {
                        $(".pv-control-recover-password-link,.pv-input-password, .pv-control-login, .pv-control-register-link, #pv-header-credentials ").slideDown(200, showAddonActions);
                    });
                });

            };

            $scope.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ];
        });
