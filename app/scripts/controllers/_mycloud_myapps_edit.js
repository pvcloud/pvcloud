angular.module('pvcloudApp').controller('_mycloud_myapps_edit', function ($scope, UtilityService, AppRegistryService, sessionService, $routeParams) {
    console.log("This is _mycloud_myapps_edit controller being invoked");

    checkForDevelopmentRedirection();
    
    console.log($routeParams);

    $scope.ArticleID = $routeParams.article_id;
    
    $scope.CurrentTab = 'basics';
            
            





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

