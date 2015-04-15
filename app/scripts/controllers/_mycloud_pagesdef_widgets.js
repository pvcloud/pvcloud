angular.module('pvcloudApp').controller('_mycloud_pagesdef_widgets', function ($scope, UtilityService, AppRegistryService, sessionService, $routeParams, $location) {

    console.log("This is _mycloud_pagesdef_widgets controller being invoked");

    initialize();

    function initialize() {
        resolveBaseBackendURL();
        getListOfWidgets();
    }

    function getListOfWidgets() {

        var wsParameters = {
            account_id: sessionService.GetCurrentAccountID(),
            token: sessionService.GetCurrentToken(),
            app_id: $routeParams.article_id,
            page_id: $routeParams.subarticle_id
        };
        
        console.log(wsParameters);

//        AppRegistryService.GetAppByID(account_id, token, app_id).$promise.then(function (appResponse) {
//            var app = appResponse.data;
//
//            if (page_id === "new") {
//                var page = {
//                    page_id: "new",
//                    app_id: app_id,
//                    title: "",
//                    description: "",
//                    visibility_type_id: 1
//                };
//                loadDataToForm(app, page);
//            } else {
//                AppRegistryService.GetPageByID(account_id, token, page_id).$promise.then(function (pageResponse) {
//                    var page = pageResponse.data;
//                    loadDataToForm(app, page);
//                });
//            }
//        });
    }

    function resolveBaseBackendURL() {
        var protocol = window.location.protocol;
        var hostname = window.location.host;
        var port = window.location.port;

        if (port === 9000 || port === '9000') {
            $scope.BackendURLBegin = protocol + "//" + window.location.hostname + ":8080";
        } else {
            $scope.BackendURLBegin = protocol + "//" + hostname;
        }
    }
});

