angular.module('pvcloudApp').controller('_mycloud_pagesdef_widgets', function ($scope, WidgetService, sessionService, $routeParams, $location) {

    console.log("This is _mycloud_pagesdef_widgets controller being invoked");
    $scope.Widgets = [];
    
    var page_id = $routeParams.p1;
    
    $scope.GoToWidgetDef = function (widget_id) {
        if (widget_id === undefined || isNaN(widget_id)) widget_id = "new";
        $location.path("/widgetsdef/" + page_id + "/" + widget_id);
    };



    initialize();

    function initialize() {
        resolveBaseBackendURL();
        getListOfWidgets();
    }

    function getListOfWidgets() {

        var wsParameters = {
            account_id: sessionService.GetCurrentAccountID(),
            token: sessionService.GetCurrentToken(),
            page_id: $routeParams.p2
        };

        console.log(wsParameters);

        WidgetService.GetWidgetsOfPageID(wsParameters.account_id, wsParameters.token, wsParameters.page_id).$promise.then(function (response) {
            console.log(response);
            if (response.status === "OK") {
                $scope.Widgets = response.data;
            }
        });

    }

    function resolveBaseBackendURL() {
        var protocol = window.location.protocol;
        var hostname = window.location.host;
        var port = window.location.port;
        var path = window.location.pathname;

        if (port === 9000) {
            $scope.URLBegin = protocol + "//" + window.location.hostname + ":8080" + path;
        } else {
            $scope.URLBegin = protocol + "//" + hostname + path;
        }
    }
});

