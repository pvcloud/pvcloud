'use strict';

angular.module('pvcloudApp').controller('MyCloudCtrl', function ($scope, $location, sessionService, utilityService) {
    $scope.$parent.ActiveView = "mycloud";
    $scope.LoggedIn = false;
    validateSession();



    function validateSession() {
        sessionService.ValidateSession().$promise.then(function (response) {
            utilityService.ProcessServiceResponse(response,
                    function success(response) {
                        $scope.LoggedIn = true;
                    },
                    function error(response) {
                        $location.path("mycloud_login");
                    },
                    function exception(response) {
                        $location.path("mycloud_login");
                    });
        });
    }
});