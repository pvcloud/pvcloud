angular.module('pvcloudApp').controller('_mycloud_myapps', function ($scope, UtilityService, AppRegistryService, sessionService) {
    console.log("This is my apps controller being invoked");
    console.log($scope);
    $scope.AddingApp = false;
    $scope.AddApp_app_nickname = "";
    $scope.AddApp_app_description = "";
    $scope.SelectedApp = undefined;
    $scope.SelectedAccountID = sessionService.GetCurrentAccountID();
    $scope.LoadingListOfAppsComplete = false;
    
    var protocol = window.location.protocol;
    //TODO: Making protocol for WGET to be HTTP until we find an easy way to install wget-ssl in Galileo
    //pvcloud_api.js driver will anyway interact ONLY with HTTPS
    
    protocol = "http:";
    var hostname = window.location.host;
    var port = window.location.port;

    if (port === 9000) {
        $scope.URLBegin = protocol + "//" + window.location.hostname + ":8080";
    } else {
        $scope.URLBegin = protocol + "//" + hostname;
    }

    getListOfAppsForAccountID();


    function getListOfAppsForAccountID() {
        var token = sessionService.GetCurrentToken();
        var account_id = sessionService.GetCurrentAccountID();

        AppRegistryService.GetAppListForAccountID(account_id, token).$promise.then(function (response) {
            UtilityService.ProcessServiceResponse(response,
                    function success(response) {
                        $scope.LoadingListOfAppsComplete = true;
                        $scope.Apps = response.data;
                        console.log(response);
                    },
                    function error(response) {
                        console.log(response);
                    },
                    function exception(response) {
                        console.log(response);
                    });
        });
    }
});

