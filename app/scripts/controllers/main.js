'use strict';

/**
 * @ngdoc function
 * @name pvcloudApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the pvcloudApp
 */
angular.module('pvcloudApp')
  .controller('MainCtrl', function ($scope) {
    $scope.$parent.ActiveView = "main";
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
