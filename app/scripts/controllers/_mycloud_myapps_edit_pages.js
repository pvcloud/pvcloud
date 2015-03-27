angular.module('pvcloudApp').controller('_mycloud_myapps_edit_pages', function ($scope, UtilityService, AppRegistryService, sessionService, $routeParams, $location) {
    console.log("This is _mycloud_myapps_edit_pages controller being invoked");
    console.log($scope);

    processDevRedirects();

    getListOfPages();

    var app_id = $routeParams.article_id;

    $scope.GoToPageDef = function () {
        $location.path("/mycloud/pagesdef/" + app_id + "/new");
    };
    $scope.GoToEditPage = function (page_id) {
        $location.path("/mycloud/pagesdef/" + app_id + "/" + page_id);
    };

    function processDevRedirects() {
        var protocol = window.location.protocol;
        var hostname = window.location.host;
        var port = window.location.port;

        if (port === 9000 || port === "9000") {
            $scope.URLBegin = protocol + "//" + window.location.hostname + ":8080";
        } else {
            $scope.URLBegin = protocol + "//" + hostname;
        }
    }
    function getListOfPages() {
        var token = sessionService.GetCurrentToken();
        var account_id = sessionService.GetCurrentAccountID();
        var app_id = $routeParams.article_id;

        AppRegistryService.GetPagesListForAppID(account_id, token, app_id).$promise.then(function (response) {
            UtilityService.ProcessServiceResponse(response,
                    function success(response) {
                        console.log(response);
                        $scope.Loading = true;
                        $scope.Pages = response.data;
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

