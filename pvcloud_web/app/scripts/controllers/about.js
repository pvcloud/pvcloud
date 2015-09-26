'use strict';

/**
 * @ngdoc function
 * @name pvcloudApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the pvcloudApp
 */
angular.module('pvcloudApp')
        .controller('AboutCtrl', function ($scope) {
            $scope.$parent.ActiveView = "about";
            $scope.ActiveView = "About";
            $scope.awesomeThings = [
                'HTML5 Boilerplate',
                'AngularJS',
                'Karma'
            ];

        });
