'use strict';

/**
 * @ngdoc function
 * @name pvcloudApp.controller:PasswordrecoveryCtrl
 * @description
 * # PasswordrecoveryCtrl
 * Controller of the pvcloudApp
 */
angular.module('pvcloudApp').controller('PasswordrecoveryCtrl', function ($scope, $routeParams, UtilityService, $sce) {
    var actionURL = UtilityService.GetBaseURL() + "account_password_recovery_execute.php";

    $scope.AccountID = $routeParams.account_id;
    $scope.ConfirmationCode = $routeParams.confirmation_code;

    if (actionURL.indexOf("9000")) {
        document.getElementById("frmPasswordRecovery").setAttribute("action", actionURL);
    }

});
