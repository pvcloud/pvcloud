'use strict';

angular.module('pvcloudApp').controller('MyCloudCtrl', function ($scope, $location, sessionService, utilityService, $routeParams) {
    $scope.$parent.ActiveView = "mycloud";
    $scope.Email = "HELLO!";
    $scope.LoggedIn = false;
    $scope.SectionURL = "";
    $scope.Section = "";
    validateSession();

    if ($routeParams.section) {        
        $scope.SectionURL = "views/_mycloud_" + $routeParams.section + ".html";        
        $scope.Section = $routeParams.section;
    } else {
        $scope.SectionURL = "views/_mycloud_main.html";
    }
    console.log("SECTION URL:");
    console.log($scope.SectionURL);


    function validateSession() {
        sessionService.ValidateSession().$promise.then(function (response) {
            utilityService.ProcessServiceResponse(response,
                    function success(response) {
                        $scope.LoggedIn = true;
                        $scope.Email = sessionService.GetCurrentEmail();
                    },
                    function error(response) {
                        $location.path("mycloud_login");
                    },
                    function exception(response) {
                        alert("Disculpas por la interrupción. Ocurrió un problema con su sesión. Por favor trate autenticándose nuevamente.");
                        $location.path("mycloud_login");
                    });
        });
    }
});