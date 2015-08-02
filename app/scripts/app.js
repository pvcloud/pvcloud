'use strict';

angular.module('pvcloudApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
])
        .config(function ($routeProvider) {
            $routeProvider
                    .when('/', {
                        templateUrl: 'views/main.html',
                        controller: 'MainCtrl'
                    })
                    .when('/page/:pageId', {
                        templateUrl: 'views/page.html',
                        controller: 'PageController'
                    })     
                    .when('/pmchart/', {
                        templateUrl: 'views/pmchart.html',
                        controller: 'PMChartController'
                    })
                    .when('/pages/', {
                        templateUrl: 'views/pages.html',
                        controller: 'PagesCtrl'
                    })
                    .when('/passwordrecovery/:account_id/:confirmation_code', {
                        templateUrl: 'views/passwordrecovery.html',
                        controller: 'PasswordrecoveryCtrl'
                    })
                    .when('/prs/', {
                        templateUrl: 'views/passwordrecoverysuccess.html'
                    })
                    .when('/err/', {
                        templateUrl: 'views/error.html'
                    })                    
                    .when('/:section', {
                        templateUrl: 'views/mycloud.html',
                        controller: 'MyCloudCtrl'
                    })
                    .when('/:section/:p1', {
                        templateUrl: 'views/mycloud.html',
                        controller: 'MyCloudCtrl'
                    })
                    .when('/:section/:p1/:p2', {
                        templateUrl: 'views/mycloud.html',
                        controller: 'MyCloudCtrl'
                    })
                    .when('/:section/:p1/:p2/:p3', {
                        templateUrl: 'views/mycloud.html',
                        controller: 'MyCloudCtrl'
                    })
                    .otherwise({
                        redirectTo: '/'
                    });
        });
