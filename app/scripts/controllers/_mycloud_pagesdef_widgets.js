angular.module('pvcloudApp').controller('_mycloud_pagesdef_widgets', function ($scope, WidgetService, sessionService, $routeParams, $location) {

    console.log("This is _mycloud_pagesdef_widgets controller being invoked");
    $scope.Widgets = [];
    initialize();

    function initialize() {
        resolveBaseBackendURL();
        getListOfWidgets();
    }

    function getListOfWidgets() {

        var wsParameters = {
            account_id: sessionService.GetCurrentAccountID(),
            token: sessionService.GetCurrentToken(),
            page_id: $routeParams.subarticle_id
        };
        
        console.log(wsParameters);
        
        WidgetService.GetWidgetsOfPageID(wsParameters.account_id, wsParameters.token, wsParameters.page_id).$promise.then(function(response){
            console.log(response);
            if(response.status==="OK"){
                $scope.Widgets=response.data;
            }
        });

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

