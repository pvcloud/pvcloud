'use strict';

angular.module('pvcloudApp').controller('MyCloudCtrl', function ($scope, $location, sessionService, UtilityService, $routeParams) {
    $scope.$parent.ActiveView = "mydevices";
    $scope.Email = "";
    $scope.LoggedIn = false;
    $scope.SectionURL = "";
    $scope.Section = "";
    $scope.Logout = logout;


    validateSession();

    if (!$routeParams.section)
        $routeParams.section = "mydevices";


    $scope.SectionURL = "views/_mycloud_" + $routeParams.section + ".html";
    $scope.Section = $routeParams.section;

    console.log("SECTION URL:");
    console.log($scope.SectionURL);


    function logout() {
        if (confirm("¿Está seguro que desea cerrar su sesión?")) {
            sessionService.Logout();
            $location.path("/");
        }
    }

    function validateSession() {
        sessionService.ValidateSession().$promise.then(function (response) {
            UtilityService.ProcessServiceResponse(response,
                    function success(response) {
                        $scope.LoggedIn = true;
                        $scope.Email = sessionService.GetCurrentEmail();
                        $scope.AccountID = sessionService.GetCurrentAccountID();
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