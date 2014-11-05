'use strict';

/**
 * @ngdoc function
 * @name pvcloudApp.controller:MyCloudCtrl
 * @description
 * # MyCloudCtrl
 * Controller of the pvcloudApp
 */
angular.module('pvcloudApp')
        .controller('MyCloudCtrl', function ($scope) {
            $scope.$parent.ActiveView = "my_cloud";
            $scope.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ];
        });
