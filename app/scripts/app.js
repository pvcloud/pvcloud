'use strict';

/**
 * @ngdoc overview
 * @name pvcloudApp
 * @description
 * # pvcloudApp
 *
 * Main module of the application.
 */
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
      .when('/my_cloud', {
        templateUrl: 'views/my_cloud.html',
        controller: 'MyCloudCtrl'
      })
      .when('/contact', {
        templateUrl: 'views/contact.html',
        controller: 'ContactCtrl'
      })
      .when('/account_add_complete', {
        templateUrl: 'views/account_add_complete.html',
        controller: 'AccountAddCompleteCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
