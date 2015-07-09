'use strict';

angular.module('pvcloudApp').controller('PageController', function ($scope, LabelsService, $location, sessionService, PageService, vseValuesService, UtilityService, $routeParams, $rootScope, $window) {
    console.log("PageController LOADED :-)");
    $scope.page = null;
    $scope.pageId = $routeParams.pageId;
    
    $scope.accountId = sessionService.GetCurrentAccountID();
    $scope.token = sessionService.GetCurrentToken();
    $scope.labelValues = [];
    $scope.dataToDraw = {};
    $scope.option = null;
    $scope.updateInterval = 1;
    $scope.chart = null;

    $scope.copyDataForFlot = function(data) {
        
        var result = [
            {
                label: "Canal 1",
                color: "#aad874",
                data: []
            }
            ];
        
        if (!data || data.length > 0) {
          var vseValue =  -1;
			for (var i = 0; i < data.length; ++i) {
			    vseValue =  data[i].vse_value;
			    vseValue = parseInt(vseValue);
			    result[0].data.push([i,vseValue]);
				
			}
        }
        return result;
        
    };
    
    $scope.update = function () {
            
    
    			$scope.plot.setData($scope.dataToDraw);
    
    			// Since the axes don't change, we don't need to call plot.setupGrid()
    
    			$scope.plot.draw();
    			
    	

        };
        
    $scope.updateChart = function() {
        $scope.chart.requestData();  
    };
    
    $window.FlotChart = function (element, url) {
        // Properties
        this.element = $(element);
        this.url = url;
        
        // Public method
        this.requestData = function () {
          var self = this;
          
          // support params (option), (option, method, callback) or (option, callback)
         
    
          //self.option = option; // save options
          vseValuesService.GetValues("PM_CANAL_1",30,1, $scope.accountId, $scope.token,"09b508f1bdc25b6ec65af3f9b9d1eb357b87776d").$promise.then(function (response) {
            UtilityService.ProcessServiceResponse(response,
                    function success(response) {
                        console.log("SUCCESS @ page");
                        $scope.labelValues = response.data;
                        $scope.dataToDraw = $scope.copyDataForFlot(response.data);
                        if (!$scope.plot) {
                            $scope.plot = $.plot( self.element,$scope.dataToDraw, $scope.option );
                        } else {
                            $scope.update();
                        }
                        setTimeout($scope.updateChart, $scope.updateInterval);
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
            $scope.chart = new FlotChart(this, source);
            $scope.option = {
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
            
           //$scope.option = option;
            $scope.chart.requestData().listen();

        });
    })();
    
 
 
  });
});