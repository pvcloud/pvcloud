'use strict';

angular.module('pvcloudApp').controller('PMChartController', function ($scope, LabelsService, $location, sessionService, UtilityService, $routeParams, $rootScope, $window) {
    console.log("PagesCtrl LOADED :-)");
    $scope.Titulo = "MY PAGE";
    // $scope.testData = [{
//   "label": "Uniques",
//   "color": "#aad874",
//   "data": [
//     ["Mar", 50],
//     ["Apr", 84],
//     ["May", 52],
//     ["Jun", 88],
//     ["Jul", 69],
//     ["Aug", 92],
//     ["Sep", 58]
//   ]
// }, {
//   "label": "Recurrent",
//   "color": "#7dc7df",
//   "data": [
//     ["Mar", 13],
//     ["Apr", 44],
//     ["May", 44],
//     ["Jun", 27],
//     ["Jul", 38],
//     ["Aug", 11],
//     ["Sep", 39]
//   ]
// }];
$scope.testData = [{
    "label": "Canal 1",
  "color": "#aad874",
  "data": [
    [1,50],
    [2,84],
    [3,52],
    [4,88],
    [5,69],
    [6,92]]
}];

$scope.testData1 = [{
  "label": "Canal 2",
  "color": "#768294",
  "data": [
    ["Mar", 31],
    ["Apr", 59],
    ["May", 59],
    ["Jun", 93],
    ["Jul", 66],
    ["Aug", 86],
    ["Sep", 60],
    ["Oct", 60],
    ["Nov", 80]
  ]
}];
    
    $window.FlotChart = function (element, url) {
        // Properties
        this.element = $(element);
        this.url = url;
    
        // Public method
        this.requestData = function (option, method, callback) {
          var self = this;
          
          // support params (option), (option, method, callback) or (option, callback)
          callback = (method && $.isFunction(method)) ? method : callback;
          method = (method && typeof method == 'string') ? method : 'GET';
    
          self.option = option; // save options
           $.plot( self.element, $scope.testData, option );
    
        //   $http({
        //       url:      self.url,
        //       cache:    false,
        //       method:   method
        //   }).success(function (data) {
              
        //       $.plot( self.element, data, option );
              
        //       if(callback) callback();
    
        //   }).error(function(){
        //     $.error('Bad chart request.');
        //   });
    
          return this; // chain-ability
    
        };
    
        // Listen to refresh events
        this.listen = function() {
          var self = this,
              chartPanel = this.element.parents('.panel').eq(0);
          
          // attach custom event
          chartPanel.on('panel-refresh', function(event, panel) {
            // request data and remove spinner when done
            self.requestData(self.option, function(){
              panel.removeSpinner();
            });
    
          });

      return this; // chain-ability
    };

  };
    
    angular.element(document).ready(function () {

  
    // Area chart
    (function () {
        var Selector = '.chart-area';
        $(Selector).each(function() {
            //var source = $(this).data('source') || $.error('Area: No source defined.');
            var source = $scope.testData;
            var chart = new FlotChart(this, source),
                option = {
                    series: {
                        lines: {
                            show: true
                        },
                        points: {
                            show: true,
                            radius: 4
                        }
                    },
                    grid: {
                        borderColor: '#eee',
                        borderWidth: 1,
                        hoverable: true
                    },
                    tooltip: true,
                    tooltipOpts: {
                        content: '%x : %y'
                    },
                    xaxis: {
                        tickColor: '#fcfcfc',
                        mode: 'categories',
                        show: false
                    },
                    yaxis: {
                        min: 0,
                        tickColor: '#eee',
                        position: 'left',
                        tickFormatter: function (v) {
                            return v + ' Kw';
                        }
                    },
                    noColumns: 5,
                    shadowSize: 0
                };
            
            // Send Request and Listen for refresh events
            chart.requestData(option).listen();

        });
    })();
    
    // (function () {
    //     var Selector = '.chart-spline';
    //     $(Selector).each(function() {
    //         //var source = $(this).data('source') || $.error('Spline: No source defined.');
    //         var source = $scope.testData1;
    //         var chart = new FlotChart(this, source),
    //             option = {
    //                 series: {
    //                     lines: {
    //                         show: false
    //                     },
    //                     points: {
    //                         show: true,
    //                         radius: 4
    //                     },
    //                     splines: {
    //                         show: true,
    //                         tension: 0.4,
    //                         lineWidth: 1,
    //                         fill: 0.5
    //                     }
    //                 },
    //                 grid: {
    //                     borderColor: '#eee',
    //                     borderWidth: 1,
    //                     hoverable: true,
    //                     backgroundColor: '#fcfcfc'
    //                 },
    //                 tooltip: true,
    //                 tooltipOpts: {
    //                     content: '%x : %y'
    //                 },
    //                 xaxis: {
    //                     tickColor: '#fcfcfc',
    //                     mode: 'categories'
    //                 },
    //                 yaxis: {
    //                     min: 0,
    //                     tickColor: '#eee',
    //                     position: ($scope.app.layout.isRTL ? 'right' : 'left'),
    //                     tickFormatter: function (v) {
    //                         return v/* + ' visitors'*/;
    //                     }
    //                 },
    //                 shadowSize: 0
    //             };
            
    //         // Send Request and Listen for refresh events
    //         chart.requestData(option).listen();

    //     });
    // })();
 
  });
});