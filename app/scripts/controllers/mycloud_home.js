'use strict';

angular.module('pvcloudApp')
  .controller('MycloudHomeCtrl', function ($scope, sessionService) {
     
    sessionService.ValidateSession().$promise.then(function(response){
        console.log(response);
    });
    
      
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });