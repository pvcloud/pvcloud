angular.module('pvcloudApp').controller('_mycloud_myapps_edit_dd', function ($scope, $location, $sce, UtilityService, AppRegistryService, sessionService, contentService) {
    console.log("This is my apps edit dd controller being invoked");
    console.log($scope);
    $scope.AddingApp = false;
    $scope.AddApp_app_nickname = "";
    $scope.AddApp_app_description = "";
    $scope.SelectedContent = undefined;
    $scope.SelectedAccountID = sessionService.GetCurrentAccountID();
    $scope.LoadingListOfContentsComplete = false;
    
    $scope.to_trusted = function(html_code) {
        console.log('' + html_code);
        console.log('' + $sce.trustAsHtml(html_code));
        return $sce.trustAsHtml(html_code);
    }

    $scope.GoToContentDef = function () {
        $location.path("/contentdef/new/");
    };
    $scope.GoToEditContent = function (content_id) {
        $location.path("/contentdef/"  + content_id);
    };

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

    getListOfContents();



    function getListOfContents() {
        var token = sessionService.GetCurrentToken();
        var account_id = sessionService.GetCurrentAccountID();

        contentService.GetListOfContents(account_id, token).$promise.then(function (response) {
            UtilityService.ProcessServiceResponse(response,
                    function success(response) {
                        $scope.LoadingListOfContentsComplete = true;
                        $scope.Contents = response.data;
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

