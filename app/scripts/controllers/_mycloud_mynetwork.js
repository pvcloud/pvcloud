'use strict';

/**
 * @ngdoc function
 * @name pvcloudApp.controller:MycloudMynetworkCtrl
 * @description
 * # MycloudMynetworkCtrl
 * Controller of the pvcloudApp
 */
angular.module('pvcloudApp')
  .controller('_mycloud_mynetwork', function ($scope) {
    
    $scope.connections ={"connections":[
    {"email":"example1@intel.com", "Name":"Jose"},
    {"email":"example2@intel.com", "Name":"Pedro"},
    {"email":"example3@intel.com", "Name":"Karla"}
]}
    
    $scope.pending ={"connections":[
    {"email":"example4@intel.com", "Name":"Jorge"},
    {"email":"example5@intel.com", "Name":"Sofia"},
    {"email":"example6@intel.com", "Name":"Marta"}
]}
    
   
        


 
  });
