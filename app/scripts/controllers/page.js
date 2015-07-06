'use strict';

angular.module('pvcloudApp').controller('PageController', function ($scope, LabelsService, $location, sessionService, PageService, vseValuesService, UtilityService, $routeParams, $rootScope, $window) {
    console.log("PageController LOADED :-)");
    $scope.page = null;
    $scope.pageId = $routeParams.pageId;
    
    $scope.accountId = sessionService.GetCurrentAccountID();
    $scope.token = sessionService.GetCurrentToken();
    $scope.labelValues = [];

//     $scope.copyDataForFlot = function(data) {
//         var result = {
//             label: "Canal 1",
//             color: "#aad874",
//             data: []
//         };
//         if (!data || data.length > 0) {
//           var vseValue =  -1;
// 			for (var i = 0; i < data.length; ++i) {
// 			    vseValue =  data[i].vse_value;
// 			    if (isNaN(vseValue) && vseValue!==null) {
// 			        vseValue = parseInt(vseValue);
// 			    }
// 				result.data.push([data[i].created_datetime,vseValue]);

// 			}
//         }
//         return result;
//     };
    
    $scope.copyDataForFlot = function(data) {
         var res = [];
        if (!data || data.length > 0) {
           var vseValue =  -1;
			for (var i = 0; i < data.length; ++i) {
			    vseValue =  data[i].vse_value;
			    if (isNaN(vseValue) && vseValue!==null) {
			        vseValue = parseInt(vseValue);
			    }
				res.push([i+1,vseValue]);

			}
        }
        return res;
    };
    
    $window.FlotChart = function (element, url) {
        // Properties
        this.element = $(element);
        this.url = url;
    
        // Public method
        this.requestData = function (option, method, callback) {
          var self = this;
          
          // support params (option), (option, method, callback) or (option, callback)
         
    
          self.option = option; // save options
        //   $.plot( self.element, $scope.testData, option );
           //https://pvcloud-janunezc.c9.io/app/backend/vse_get_values.php?optional_vse_label=PM_CANAL_1&optional_last_limit=10&app_id=1&account_id=1&token=34b2abb7abddefd870544f8f5a27795bca2dd552&api_key=09b508f1bdc25b6ec65af3f9b9d1eb357b87776d
          vseValuesService.GetValues("PM_CANAL_1",30,1, $scope.accountId, $scope.token,"09b508f1bdc25b6ec65af3f9b9d1eb357b87776d").$promise.then(function (response) {
            UtilityService.ProcessServiceResponse(response,
                    function success(response) {
                        console.log("SUCCESS @ page");
                        $scope.labelValues = response.data;
                        $.plot( self.element, $scope.copyDataForFlot(response.data), option );
                    },
                    function error(response) {
                        console.log("ERROR @ page " + response);
                        $location.path("/");
                    },
                    function exception(response) {
                        console.log("EXCEPTION @ myClpageoud");
                        alert("Disculpas por la interrupción. Ocurrió un problema.");
                        $location.path("/");
                    });
        });
    
        
    
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
  
  $scope.initPageData = function() {
      
      PageService.GetPage($scope.accountId, $scope.token,$scope.pageId).$promise.then(function (response) {
            UtilityService.ProcessServiceResponse(response,
                    function success(response) {
                        console.log("SUCCESS @ page");
                        $scope.page = response.data;
                    },
                    function error(response) {
                        console.log("ERROR @ page " + response);
                        $location.path("/");
                    },
                    function exception(response) {
                        console.log("EXCEPTION @ myClpageoud");
                        alert("Disculpas por la interrupción. Ocurrió un problema.");
                        $location.path("/");
                    });
        });
  }
  
  $scope.initPageData();
  
    
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