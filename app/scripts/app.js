'use strict';

angular
        .module('pvcloudApp', [
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
                    .when('/about', {
                        templateUrl: 'views/about.html',
                        controller: 'AboutCtrl'
                    })
                    .when('/mycloud/:section/:article_id/:subarticle_id',{
                        templateUrl: 'views/mycloud.html',
                        controller: 'MyCloudCtrl'
                    })  
                    .when('/mycloud/:section/:article_id/:subarticle_id/:widget_id',{
                        templateUrl: 'views/mycloud.html',
                        controller: 'MyCloudCtrl'
                    })
                    .when('/mycloud/:section/:article_id', {
                        templateUrl: 'views/mycloud.html',
                        controller: 'MyCloudCtrl'
                    })
                    .when('/mycloud/:section', {
                        templateUrl: 'views/mycloud.html',
                        controller: 'MyCloudCtrl'
                    })
                    .when('/mycloud', {
                        templateUrl: 'views/mycloud.html',
                        controller: 'MyCloudCtrl'
                    })
                    .when('/pmchart', {
                        templateUrl: 'views/pmchart.html',
                        controller: 'PMChartController'
                    })
                    .when('/page/:pageId', {
                        templateUrl: 'views/page.html',
                        controller: 'PageController'
                    }) 
                    .when('/pages', {
                        templateUrl: 'views/pages.html',
                        controller: 'PagesCtrl'
                    })                    
                    .when('/passwordrecovery/:account_id/:confirmation_code', {
                        templateUrl: 'views/passwordrecovery.html',
                        controller: 'PasswordrecoveryCtrl'
                    })
                    .when('/prs', {
                        templateUrl: 'views/passwordrecoverysuccess.html'
                    })
                    .when('/err', {
                        templateUrl: 'views/error.html'
                    })
                    .otherwise({
                        redirectTo: '/pages'
                    });
        });
