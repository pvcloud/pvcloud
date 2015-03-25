angular.module('pvcloudApp').controller('_mycloud_myapps_edit', function ($scope, UtilityService, AppRegistryService, sessionService, $routeParams) {
    console.log("This is _mycloud_myapps_edit controller being invoked");
    $scope.Tabs = {
        Basics: 'basics',
        DocsNDrivers: 'docs_n_drivers',
        Pages: 'pages',
        Data: 'data'
    };


    checkForDevelopmentRedirection();

    initialize();


    function initialize() {
        $scope.ArticleID = $routeParams.article_id;

        if ($routeParams.article_id !== "new") {
            var token = sessionService.GetCurrentToken();
            var account_id = sessionService.GetCurrentAccountID();
            $scope.ApplicationID = $routeParams.article_id;
            AppRegistryService.GetAppByID(account_id, token, $scope.ApplicationID).$promise.then(function (response) {
                $scope.Application = response.data;
                console.log($scope.Application);
                $scope.AppName = $scope.Application.app_nickname;
                $scope.AppDescription = $scope.Application.app_description;
                $scope.AppAPIKEY = $scope.Application.api_key;
                $scope.AppVisibility = 1;

            });
        } else {
            $scope.ApplicationID = undefined;
        }

        $scope.CurrentTab = $scope.Tabs.Basics;

        $scope.SwitchToTab = function (tab) {
            $scope.CurrentTab = tab;
        };
    }

    function checkForDevelopmentRedirection() {
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
    }


});

