'use strict';

angular.module('pvcloudApp').controller('PasswordrecoverySuccessCtrl', function ($scope, $routeParams, UtilityService, $rootScope, $location, LabelsService) {
    LabelsService.GetLabels(function (labels) {
        $rootScope.PageLabels = labels;
    });

    $scope.SwitchLanguage = function (lang_code) {
        LabelsService.GetLanguageLabels(lang_code, function (labels) {
            $rootScope.PageLabels = labels;
        });
    };

    if ($location.port() !== 9000) {
        console.log("port is not 9000");
        if ($location.protocol() !== "https") {
            var currentURL = window.location.href;
            var newURL = currentURL.replace("http", "https").replace(":8080", "");
            window.location.href = newURL;
            return;
        }
    } else {
        console.log("Port is 9000");
    }

    console.log($location.port());

    var actionURL = UtilityService.GetBackendBaseURL() + "account_password_recovery_execute.php";

    $scope.AccountID = $routeParams.account_id;
    $scope.ConfirmationCode = $routeParams.confirmation_code;

});
