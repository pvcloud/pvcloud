'use strict';

/**
 * @ngdoc function
 * @name pvcloudApp.controller:ContactCtrl
 * @description
 * # ContactCtrl
 * Controller of the pvcloudApp
 */
angular.module('pvcloudApp')
  .controller('ContactCtrl', function ($scope) {
    $scope.$parent.ActiveView = "contact";
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
