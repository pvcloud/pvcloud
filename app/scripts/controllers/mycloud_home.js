'use strict';

angular.module('pvcloudApp').controller('MycloudHomeCtrl', function ($scope, $location, sessionService, utilityService) {
    console.log("CHECKING...");
    sessionService.ValidateSession().$promise.then(function (response) {
        utilityService.ProcessServiceResponse(response,
                function success(response) {
                    console.log("SUCCESS");
                },
                function error(response) {
                    console.log("ERROR");
                    alert(response.message);
                    $location.path("/#/");
                },
                function exception(response) {
                    console.log("EXCEPTION");
                    alert(response.message);
                    $location.path("/#/");
                });
    });
});