'use strict';

angular.module('pvcloudApp').controller('PageController', function ($scope, LabelsService, $location, sessionService, PageService, vseValuesService, vseWidgetValuesService, AppRegistryService, UtilityService, $routeParams, $rootScope, $window) {
    console.log("PageController LOADED :-)");
    $scope.page = null;
    $scope.pageId = $routeParams.pageId;
    
    $scope.accountId = sessionService.GetCurrentAccountID();
    $scope.token = sessionService.GetCurrentToken();
    $scope.labelValues = [];
    $scope.dataToDraw = {};
    $scope.option = null;
    $scope.updateInterval = 1000;
    $scope.chart = null;
    $scope.charts = [];
    $scope.MAX_LIMIT = 60;
    
    $scope.findWidgetConfigFromList = function(label, widget) {
        var config = null;
        for (var i = 0; i < widget.widget_configs.length; ++i) {
		    if (widget.widget_configs[i].vse_label === label) {
			    config = widget.widget_configs[i];
			    break;
		    }
				
		}    
		return config;
    };
    
    $scope.findWidgetById = function(widgetId) {
        var widget = null;
        for (var i = 0; i < $scope.page.widgets.length; ++i) {
		    if ($scope.page.widgets[i].widget_id === widgetId) {
			    widget = $scope.page.widgets[i];
			    break;
		    }
				
		}
		return widget;
        
        
    };
    
    $scope.findWidgetConfig = function(label,widgetId) {
//         var config = null;
//         for (var i = 0; i < $scope.page.widgets.length; ++i) {
// 		    if ($scope.page.widgets[i].widget_id === widgetId) {
// 			    config = $scope.findWidgetConfigFromList(label,$scope.page.widgets[i])
// 		    }
				
// 		}
// 		return config;

        var config = null;
        var widget = $scope.findWidgetById(widgetId);
        if (widget) {
			config = $scope.findWidgetConfigFromList(label,widget);
		}
		return config;
        
        
    };
    
   $scope.generateRandomColor = function() {
       var color = Math.floor(Math.random()*16777215).toString(16);
       return "#" + color;
   };
    
    $scope.initChannelCustomDataInPlot = function(label,widgetId) {
        var result = {
            lines: { show: true },
            label: "",
            color: "",
            data: []
        };
        if ($scope.page && $scope.page.widgets && $scope.page.widgets.length > 0) {
            var widgetConfigForLabel = $scope.findWidgetConfig(label,widgetId);
            if (widgetConfigForLabel) {
                result.label = widgetConfigForLabel.friendly_label;
                if (widgetConfigForLabel.options_json) {
                    var options = null;
                    try {
                        options = JSON.parse(widgetConfigForLabel.options_json);
                    } catch(exc) {
                       console.log("Error @ Json parse color");
                       options = null;
                       result.color = $scope.generateRandomColor();
                    //   if (label==="PM_CANAL_1") {
                    //       result.color = "#aad874";
                    //   } else if (label==="PM_CANAL_2") {
                    //       result.color = "#FFA500";
                    //   } else if (label==="PM_CANAL_3") {
                    //      result.color = "#FF0000";  
                    //   } else {
                    //      result.color = $scope.generateRandomColor();
                    //   }
                    }
                    if (options && options.color) {
                        result.color = options.color;
                    }
                }
            } else {
                result.color = $scope.generateRandomColor();
            }
            
        }
        
        return result;
    };
    
    $scope.copyDataLabelForPlot = function(data, label, widgetId) {
        var result = $scope.initChannelCustomDataInPlot(label, widgetId);
        if (!data || data.length > 0) {
            var vseValues = [];
          var vseValue =  -1;
          var vseCreatedTimestamp;
			for (var i = 0; i < data.length; ++i) {
			    if (data[i].vse_label === label) {
    			    vseValue =  data[i].vse_value;
    			    vseValue = parseInt(vseValue);
    			    vseCreatedTimestamp = Date.parse(data[i].created_datetime);
    			    
    			    //vseValues.push([new Date(data[i].created_datetime),vseValue]);
    			    vseValues.unshift([new Date(data[i].created_datetime),vseValue]);
    			    
    			    //vseValues.push([vseCreatedTimestamp,vseValue]);
    			    //result.data.push([i,vseValue]);
    			    //result.data.push([data[i].created_datetime,vseValue]);
			    }
				
			}
			//vseValues.reverse();
			
// 			for (var i = 0; i < vseValues.length; ++i) {
// 			    result.data.push([i,vseValues[i]]);
// 			}
            result.data = vseValues;
			
			
			//result.data.reverse();
        }
        return result;
        
    };

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
		$scope.plot.draw();
    };
        
    $scope.updateChart = function() {
       // $scope.chart.requestData();  
        if ($scope.charts && $scope.charts.length > 0) {
            for (var i = 0; i < $scope.charts.length; ++i) {
			     $scope.charts[i].requestData();  	
			}
        }
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
    
    $scope.processDataByLabels = function(dataList, widgetId) {
        var widget = $scope.findWidgetById(widgetId);
        var result = [];
        if (widget && widget.widget_configs) {
            for (var i = 0; i < widget.widget_configs.length; ++i) {
                if (widget.widget_configs[i].vse_label) {
                    var dataResult = $scope.copyDataLabelForPlot(dataList,widget.widget_configs[i].vse_label,widgetId)
                    if (dataResult) {
                        result.push(dataResult);
                    }
                }
			 //   if (!$scope.page.widgets[i].wasCreated) {
			 //       $scope.page.widgets[i].wasCreated = true;
			 //       widgetId = $scope.page.widgets[i].widgetId;
			 //       break;
			 //   }	
			}
        }
        return result;
        
    };
    
    $scope.mergeWithLastData = function(newData) {
        //TODO
        // Merge con los datos anteriores: ejemplo si no optiene nada solo graficar lo ultimo
        // si optione 3 remover 3 y agregar esos 3 al inicio de la lista
        
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
        
    }
    
    $window.FlotChart = function (element, widgetId) {
        // Properties
        this.element = $(element);
        this.widgetId = widgetId;
        this.last_entry_id = 0;
        
        // Public method
        this.requestData = function () {
            var self = this;
            if (this.widgetId===-1) {
                this.widgetId = $scope.getNextWidgetId();
            }
            // vseValuesService.GetValues("PM_CANAL_1",30,1, $scope.accountId, $scope.token,"09b508f1bdc25b6ec65af3f9b9d1eb357b87776d").$promise.then(function (response) {
            //     UtilityService.ProcessServiceResponse(response,
            //             function success(response) {
            //                 console.log("SUCCESS @ page");
            //                 $scope.labelValues = response.data;
            //                 $scope.dataToDraw = $scope.copyDataForFlot(response.data);
            //                 if (!$scope.plot) {
            //                     $scope.plot = $.plot( self.element,$scope.dataToDraw, $scope.option );
            //                 } else {
            //                     $scope.update();
            //                 }
            //                 setTimeout($scope.updateChart, $scope.updateInterval);
            //             },
            //             function error(response) {
            //                 console.log("ERROR @ page " + response);
            //                 $location.path("/");
            //             },
            //             function exception(response) {
            //                 console.log("EXCEPTION @ myClpageoud");
            //                 alert("Disculpas por la interrupción. Ocurrió un problema.");
            //                 $location.path("/");
            //             });
            // });
    
            vseWidgetValuesService.GetWidgetValues(this.widgetId,this.last_entry_id,$scope.MAX_LIMIT,$scope.app.app_id, $scope.accountId, $scope.token,$scope.app.api_key).$promise.then(function (response) {
                UtilityService.ProcessServiceResponse(response,
                        function success(response) {
                            console.log("SUCCESS @ page");
                            
                            //$scope.dataToDraw = $scope.processDataByLabels(response.data);
                            if (response.data && response.data.length > 0)  {
                            //if (response.data)  {
                                $scope.currentResponseData = response.data;
                                
                                $scope.labelValues = $scope.mergeWithLastData($scope.currentResponseData);
                                if ($scope.labelValues && $scope.labelValues.length >0) {
                                    self.last_entry_id = $scope.labelValues[0].entry_id;
                                }
                                $scope.dataToDraw = $scope.processDataByLabels($scope.labelValues,self.widgetId);
                                if (!$scope.plot) {
                                    $scope.plot = $.plot( self.element,$scope.dataToDraw, $scope.option );
                                } else {
                                    //$scope.update();
                                    $.plot( self.element,$scope.dataToDraw, $scope.option );
                                }
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
  
  $scope.requestDataForPendings = function() {
      for (var i = 0; i < $scope.charts.length; ++i) {
			    if ($scope.charts[i].pendingToRequestData) {
    			    $scope.charts[i].requestData();
			    }
				
			}
      
  }
  
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
  }
  
  
  
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
            var Selector = '.chart-line';
            $(Selector).each(function() {
                $scope.chart = new FlotChart(this, $scope.getNextWidgetId());
                // $scope.option = {
                //         series: {
                //             lines: {
                //                 show: true
                //             },
                //             points: {
                //                 show: true,
                //                 radius: 4
                //             }
                //         },
                //         grid: {
                //             borderColor: '#eee',
                //             borderWidth: 1,
                //             hoverable: true
                //         },
                //         tooltip: true,
                //         tooltipOpts: {
                //             content: '%x : %y'
                //         },
                //         xaxis: {
                //             tickColor: '#fcfcfc',
                //             mode: 'time',
                //             show: false
                //         },
                //         yaxis: {
                //             min: 0,
                //             tickColor: '#eee',
                //             position: 'left',
                //             tickFormatter: function (v) {
                //                 return v + ' Kw';
                //             }
                //         },
                //         noColumns: 5,
                //         shadowSize: 0
                //     };
               
                // $scope.option = {
                //         series: {
                //             lines: {
                //                 show: true,
                //                 lineWidth: 2,
                //                 fill: false
                //             },
                //             points: {
                //                 show: true,
                //                  radius: 2
                //             }
                //         },
                //         grid: {
                //             borderColor: '#eee',
                //             borderWidth: 1,
                //             hoverable: true
                //         },
                //         tooltip: true,
                //         tooltipOpts: {
                //             content: '%x : %y'
                //         },
                //         xaxis: {
                //             show: false,
                //             tickSize: [5, "second"],
                //             mode: "time",        
                //             tickFormatter: function (v, axis) {
                //                 var date = v;
                    
                //                 if (date.getSeconds() % 20 == 0) {
                //                     var hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
                //                     var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
                //                     var seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
                    
                //                     return hours + ":" + minutes + ":" + seconds;
                //                 } else {
                //                     return "";
                //                 }
                //             },
                //             color: "#eee",
                //             axisLabel: "Tiempo",
                //             axisLabelUseCanvas: true,
                //             axisLabelFontSizePixels: 12,
                //             axisLabelFontFamily: 'Verdana, Arial',
                //             axisLabelPadding: 10
                //         },
                //         yaxis: {
                //             tickColor: '#eee',
                //             position: 'left',
                //             tickFormatter: function (v) {
                //                 return v + ' Kw';
                //             }
                //         },
                //         shadowSize: 0
                //     };
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
               if ($scope.page && $scope.app) {
                    $scope.chart.pendingToRequestData = false;
                    $scope.chart.requestData().listen();
               } else {
                    $scope.chart.pendingToRequestData = true;
               }
               // $scope.chart.requestData().listen();
    
            });
        })();
    
 
 
    });
});