'use strict';

angular.module('pvcloudApp').controller('PMChartController', function ($scope, LabelsService, vseWidgetValuesService,AppRegistryService, $location, sessionService, UtilityService, PageService,$routeParams, $rootScope, $window) {
    console.log("PagesCtrl LOADED :-)");
    
    $scope.page = null;
    $scope.pageId = 30;
    
    $scope.accountId = sessionService.GetCurrentAccountID();
    $scope.token = sessionService.GetCurrentToken();
    $scope.labelValues = [];
    $scope.dataToDraw = {};
    $scope.option = null;
    $scope.updateInterval = 1000;
    $scope.chart = null;
    $scope.charts = [];
    $scope.MAX_LIMIT = 60;
    $scope.labelsColor = [];
    $scope.Titulo = "MY PAGE";
    
$scope.testData = [{
    "label": "Canal 1",
  "color": "#aad874",
  "data": [
    [new Date("2015-07-16 4:01").getTime(),50],
    [new Date("2015-07-16 4:10").getTime(),84],
    [new Date("2015-07-16 5:33").getTime(),52],
    [new Date("2015-07-16 6:11").getTime(),66],
    [new Date("2015-07-16 7:44").getTime(),69],
    [new Date("2015-07-16 8:31").getTime(),80]]
}];

// $scope.testData = [{
//     "label": "Canal 1",
//   "color": "#aad874",
//   "data": [
//     [1,50],
//     [2,84],
//     [3,52],
//     [4,66],
//     [5,69],
//     [6,80]]
// }];

    $scope.validateSession = function() {
        sessionService.ValidateSession().$promise.then(function (response) {
            UtilityService.ProcessServiceResponse(response,
                    function success(response) {
                        console.log("SUCCESS @ myCloud");
                        $scope.LoggedIn = true;
                        $scope.Email = sessionService.GetCurrentEmail();
                        $scope.AccountID = sessionService.GetCurrentAccountID();
                    },
                    function error(response) {
                        console.log("ERROR @ myCloud");
                        $location.path("/");
                    },
                    function exception(response) {
                        console.log("EXCEPTION @ myCloud");
                        alert("Disculpas por la interrupción. Ocurrió un problema con su sesión. Por favor trate autenticándose nuevamente.");
                        $location.path("/");
                    });
        });
    }
    $scope.validateSession();

  $scope.requestDataForPendings = function() {
      for (var i = 0; i < $scope.charts.length; ++i) {
			    if ($scope.charts[i].pendingToRequestData) {
    			    $scope.charts[i].requestData();
			    }
				
			}
      
  };
  
  $scope.getRefreshFrequencyByWidgetId = function(widgetId) {
        var defaultRefresh = 1000;
        if ($scope.page && $scope.page.widgets) {
            for (var i = 0; i < $scope.page.widgets.length; ++i) {
			    if ($scope.page.widgets[i].widgetId === widgetId) {
			        defaultRefresh = $scope.page.widgets[i].refresh_frequency_sec;
			        break;
			    }	
			}
        }
        return defaultRefresh;
    };
    
    $scope.mergeWithLastData = function(newData) {
        
        // POINTS 60 
       if (!newData || newData.length===0) {
            return $scope.labelValues;
        }
        if (newData.length === $scope.MAX_LIMIT) {
            return newData;
        }
        var remainValues = $scope.MAX_LIMIT - newData.length; 
        if (remainValues <= 0) {
            return newData;
        }
        var current;
        for (var i = 0; i < remainValues && $scope.labelValues.length > i; ++i) {
            current = $scope.labelValues[i];
		    newData.push(current);
			
		}
		return newData;
        
    };
    
    $window.FlotChart = function (element, widgetId) {
        // Properties
        this.element = $(element);
        this.widgetId = widgetId;
        this.refreshFrequency = null;
        this.last_entry_id = 0;
    
        // Public method
        this.requestData = function (option, method, callback) {
         var self = this;
            if (this.widgetId===-1) {
                this.widgetId = $scope.getNextWidgetId();
                
            }
            if (!this.refreshFrequency) {
                $scope.updateInterval = $scope.getRefreshFrequencyByWidgetId(this.widgetId);
                this.refreshFrequency = $scope.updateInterval;
            } else {
                $scope.updateInterval = this.refreshFrequency;
            }
          
          vseWidgetValuesService.GetWidgetValues(this.widgetId,this.last_entry_id,$scope.MAX_LIMIT,$scope.app.app_id, $scope.accountId, $scope.token,$scope.app.api_key).$promise.then(function (response) {
                UtilityService.ProcessServiceResponse(response,
                        function success(response) {
                            console.log("SUCCESS @ page");
                            
                            if (response.data && response.data.length > 0)  {
                           
                                $scope.currentResponseData = response.data;
                                
                                
                                
                                $scope.labelValues = $scope.mergeWithLastData($scope.currentResponseData);
                                
                                self.option = option; // save options
                                $.plot( self.element, $scope.testData, option );
                                // if ($scope.labelValues && $scope.labelValues.length >0) {
                                //     self.last_entry_id = $scope.labelValues[0].entry_id;
                                // }
                                // $scope.dataToDraw = $scope.processDataByLabels($scope.labelValues,self.widgetId);
                                // if (!$scope.plot) {
                                //     $scope.plot = $.plot( self.element,$scope.dataToDraw, $scope.option );
                                // } else {
                                    
                                //     $.plot( self.element,$scope.dataToDraw, $scope.option );
                                // }
                            }
                            //setTimeout($scope.updateChart, $scope.updateInterval);
                        },
                        function error(response) {
                            console.log("ERROR @ page " + response);
                            $location.path("/");
                        },
                        function exception(response) {
                            console.log("EXCEPTION @ page");
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
  
  $scope.getNextWidgetId = function() {
        var widgetId = -1;
        if ($scope.page && $scope.page.widgets) {
            for (var i = 0; i < $scope.page.widgets.length; ++i) {
			    if (!$scope.page.widgets[i].wasCreated) {
			        $scope.page.widgets[i].wasCreated = true;
			        widgetId = $scope.page.widgets[i].widget_id;
			        break;
			    }	
			}
        }
        return widgetId;
    };
  
  $scope.initAppById = function() {
      
      AppRegistryService.GetAppByID($scope.accountId, $scope.token,$scope.page.app_id).$promise.then(function (response) {
            UtilityService.ProcessServiceResponse(response,
                    function success(response) {
                        console.log("SUCCESS @ Get App");
                        $scope.app = response.data;
                        $scope.requestDataForPendings();
                    },
                    function error(response) {
                        console.log("ERROR @ Get APP " + response);
                        $location.path("/");
                    },
                    function exception(response) {
                        console.log("EXCEPTION @ Get APP");
                        alert("Disculpas por la interrupción. Ocurrió un problema.");
                        $location.path("/");
                    });
        });
  };
  
  $scope.initPageData = function() {
      
      PageService.GetPage($scope.accountId, $scope.token,$scope.pageId).$promise.then(function (response) {
            UtilityService.ProcessServiceResponse(response,
                    function success(response) {
                        console.log("SUCCESS @ page");
                        $scope.page = response.data;
                        $scope.initAppById();
                    },
                    function error(response) {
                        console.log("ERROR @ page " + response);
                        $location.path("/");
                    },
                    function exception(response) {
                        console.log("EXCEPTION @ page");
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
             $scope.chart = new FlotChart(this, $scope.getNextWidgetId());
            var source = $scope.testData;
            $scope.option = {
                    series: {
                        lines: {
                            show: true,
                            fill: 0.01
                        },
                        points: {
                            show: true,
                            radius: 4
                        }
                    },
                    grid: {
                        borderColor: '#eee',
                        borderWidth: 1,
                        hoverable: true,
                        backgroundColor: '#fcfcfc'
                    },
                    tooltip: true,
                    tooltipOpts: {
                        content: '%x : %y'
                    },
                    xaxis: {
                        
                        tickColor: '#eee',
                        mode: 'time'
                    },
                    yaxis: {
                        position: 'left',
                        tickColor: '#eee'
                    },
                    shadowSize: 0
                };

               $scope.charts.push($scope.chart);
            
            // Send Request and Listen for refresh events
           //$scope.chart.requestData($scope.option).listen();
           
           if ($scope.page && $scope.app) {
                    $scope.chart.pendingToRequestData = false;
                    $scope.chart.requestData().listen();
               } else {
                    $scope.chart.pendingToRequestData = true;
               }
    
        });
    })();
    
    
 
  });
});