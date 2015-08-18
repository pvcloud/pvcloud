'use strict';

angular.module('pvcloudApp').controller('MyCloudCtrl', function ($scope, LabelsService, $location, sessionService, UtilityService, $routeParams, $rootScope) {
    $scope.$parent.ActiveView = "myapps";
    $scope.Email = "";
    $scope.LoggedIn = false;
    $scope.SectionURL = "";
    $scope.Section = "";
    $scope.Logout = logout;
    $scope.GoToNewApp = gotoNewApp;
    $scope.GoToInviteAFriend = goToInviteAFriend;

    LabelsService.GetLabels(function (labels) {
        $rootScope.PageLabels = labels;
    });

    $scope.SwitchLanguage = function (lang_code) {
        LabelsService.GetLanguageLabels(lang_code, function (labels) {
            $rootScope.PageLabels = labels;
        });
    };

    validateSession();
    console.log("IM HERE!!!!!");
    console.log($location.$$path);
    console.log($routeParams);

    setSection();

    function setSection() {
        var sectionName = $routeParams.section;
        console.log("LOCATION HERE");
        console.log($location);
        console.log(sectionName);
        $scope.Section = sectionName;
        switch (sectionName) {
            case "widgetsdef":
                $scope.SectionURL = "views/_mycloud_widgetsdef.html";
                break;
            case "pagesdef":
                $scope.SectionURL = "views/_mycloud_pagesdef.html";
                break;
            case "contentdef":
                $scope.SectionURL = "views/_mycloud_contentdef.html";
                break;
            case "apps":
                if ($routeParams.p1) {
                    $scope.SectionURL = "views/_mycloud_myapps_edit.html";
                } else {
                    $scope.SectionURL = "views/_mycloud_myapps.html";
                }
                break;

            case "network":
                $scope.SectionURL = "views/_mycloud_mynetwork.html";
                break;

            case "account":
                $scope.SectionURL = "views/_mycloud_myaccount.html";
                break;

            case "about":
                $scope.SectionURL = "views/about.html";
                break;
        }
    }

    function goToInviteAFriend() {
        $location.path("/mycloud/inviteafriend");
    }
    function gotoNewApp() {
        $location.path("/apps/new");
    }
    function logout() {
        if (confirm("¿Está seguro que desea cerrar su sesión?")) {
            console.log("LOGOUT IS CALLED HERE!!!!!!");
            var account_id = sessionService.GetCurrentAccountID();
            var token = sessionService.GetCurrentToken();

            console.log({account_id: account_id, token: token});
            sessionService.Logout(account_id, token);
            $location.path("/");
        }
    }

    function validateSession() {
        sessionService.ValidateSession().$promise.then(function (response) {
            UtilityService.ProcessServiceResponse(response,
                    function success(response) {
                        console.log("SUCCESS @ myCloud");
                        $scope.LoggedIn = true;
                        $scope.Email = sessionService.GetCurrentEmail();
                        $scope.AccountID = sessionService.GetCurrentAccountID();
                    },
                    function error(response) {
                        console.log("ERROR @ myCloud");
                        $location.path("/");
                    },
                    function exception(response) {
                        console.log("EXCEPTION @ myCloud");
                        alert("Disculpas por la interrupción. Ocurrió un problema con su sesión. Por favor trate autenticándose nuevamente.");
                        $location.path("/");
                    });
        });
    }
});