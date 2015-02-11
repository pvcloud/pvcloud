'use strict';

angular.module('pvcloudApp').controller('PasswordrecoveryCtrl', function ($scope, $routeParams, UtilityService, $sce, $location) {
    if ($location.port() !== "9000") {
        if ($location.protocol() !== "https") {
            var currentURL = window.location.href;
            var newURL = currentURL.replace("http", "https").replace(":8080", "");
            window.location.href = newURL;
            return;
        }
    }
    
    var actionURL = UtilityService.GetBackendBaseURL() + "account_password_recovery_execute.php";

    $scope.AccountID = $routeParams.account_id;
    $scope.ConfirmationCode = $routeParams.confirmation_code;

    if (actionURL.indexOf("9000")) {
        document.getElementById("frmPasswordRecovery").setAttribute("action", actionURL);
    }

});
