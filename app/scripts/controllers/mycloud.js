'use strict';

angular.module('pvcloudApp').controller('MyCloudCtrl', function ($scope, $location, sessionService, UtilityService, $routeParams) {
    $scope.$parent.ActiveView = "myapps";
    $scope.Email = "";
    $scope.LoggedIn = false;
    $scope.SectionURL = "";
    $scope.Section = "";
    $scope.Logout = logout;
    $scope.GoToNewApp = gotoNewApp;
    $scope.GoToInviteAFriend = goToInviteAFriend;

    validateSession();

    console.log($routeParams);

    if (!$routeParams.section)
        $routeParams.section = "myapps";
    


    $scope.SectionURL = "views/_mycloud_" + $routeParams.section;
    
    if($routeParams.article_id){
        $scope.SectionURL += "_edit";
    }
    
    $scope.SectionURL += ".html";
    $scope.Section = $routeParams.section;

    console.log("SECTION URL:");
    console.log($scope.SectionURL);


    function goToInviteAFriend(){
        $location.path("/mycloud/mynetwork/inviteafriend");
    }
    function gotoNewApp(){
        $location.path("/mycloud/myapps/new");
    }
    function logout() {
        if (confirm("¿Está seguro que desea cerrar su sesión?")) {
            console.log("LOGOUT IS CALLED HERE!!!!!!");
            var account_id = sessionService.GetCurrentAccountID();
            var token = sessionService.GetCurrentToken();
            
            console.log({account_id:account_id, token:token});
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