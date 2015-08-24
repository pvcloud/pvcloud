'use strict';

angular.module('pvcloudApp').controller('PageController', function ($scope, LabelsService, addVseValueService, $location, sessionService, PageService, vseValuesService, vseLastValueService, vseWidgetValuesService, AppRegistryService, UtilityService, $routeParams, $rootScope, $window) {
    console.log("PageController LOADED :-)");
    var WIDGET_TYPE_CHARTING = 4;
    var WIDGET_TYPE_DISPLAY = 1;
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
    $scope.offAndOns = [];
    $scope.offAndOn = null;
    $scope.MAX_LIMIT = 60;
    $scope.labelsColor = [];

    //SHOULD BE CHANGED to a generic solution
    $scope.pumpOn = "";
    $scope.chillerOn = "";
    $scope.chartTitle = "";
    $scope.offAndOnTitle = "";

    $scope.lastValueWidgetUpdate = [];

    $scope.lastValueVse = [];

    $scope.validateSession();
    $scope.initPageData();

    $scope.validateSession = function () {
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
    };

    $scope.findWidgetConfigFromList = function (label, widget) {
        var config = null;
        for (var i = 0; i < widget.widget_configs.length; ++i) {
            if (widget.widget_configs[i].vse_label === label) {
                config = widget.widget_configs[i];
                break;
            }
        }
        return config;
    };

    $scope.findColorByLabel = function (label) {
        var color = null;
        for (var i = 0; i < $scope.labelsColor.length; ++i) {
            if ($scope.labelsColor[i].label === label) {
                color = $scope.labelsColor[i].color;
                break;
            }
        }
        return color;
    };

    $scope.findWidgetById = function (widgetId) {
        var widget = null;
        var idToFind = parseInt(widgetId);
        for (var i = 0; i < $scope.page.widgets.length; ++i) {
            if ($scope.page.widgets[i].widget_id === idToFind) {
                widget = $scope.page.widgets[i];
                break;
            }

        }
        return widget;


    };

    $scope.findWidgetConfig = function (label, widgetId) {
        var config = null;
        var widget = $scope.findWidgetById(widgetId);
        if (widget) {
            config = $scope.findWidgetConfigFromList(label, widget);
        }
        return config;


    };

    $scope.isWidgetUpdated = function (idWidget) {
        var result = false;
        if (!$scope.lastValueWidgetUpdate) {
            return false;
        }
        for (var i = 0; i < $scope.lastValueWidgetUpdate.length; ++i) {
            if ($scope.lastValueWidgetUpdate[i] === idWidget) {
                result = true;
                break;
            }

        }
        return result;
    };

    $scope.generateRandomColor = function () {
        var color = Math.floor(Math.random() * 16777215).toString(16);
        return "#" + color;
    };

    $scope.initChannelCustomDataInPlot = function (label, widgetId) {
        var result = {
            lines: {show: true},
            label: "",
            color: "",
            data: []
        };
        if ($scope.page && $scope.page.widgets && $scope.page.widgets.length > 0) {
            var widgetConfigForLabel = $scope.findWidgetConfig(label, widgetId);
            var found = true;
            if (widgetConfigForLabel) {
                result.label = widgetConfigForLabel.friendly_label;
                result.color = $scope.findColorByLabel(label);
                found = result.color != null;
                if (!found && widgetConfigForLabel.options_json) {
                    var options = null;
                    try {
                        options = JSON.parse(widgetConfigForLabel.options_json);
                    } catch (exc) {
                        console.log("Error @ Json parse color");
                        options = null;
                        result.color = $scope.generateRandomColor();

                    }
                    if (options && options.color) {
                        result.color = options.color;
                    }
                }
            } else {
                result.color = $scope.generateRandomColor();
            }
            if (!found) {
                $scope.labelsColor.push({
                    label: label,
                    color: result.color
                })
            }

        }

        return result;
    };

    $scope.parseVseValue = function (rawValue, typeName) {
        var vseValue = rawValue;
        if (typeName === "NUMERIC") {
            vseValue = parseInt(rawValue);
        } else if (typeName === "FLOAT") {
            vseValue = parseFloat(rawValue);
        }

        return vseValue;
    };

    $scope.copyDataLabelForPlot = function (data, label, widgetId) {
        var result = $scope.initChannelCustomDataInPlot(label, widgetId);
        if (!data || data.length > 0) {
            var vseValues = [];
            var vseValue = -1;
            var vseCreated;
            for (var i = data.length - 1; i >= 0; i--) {
                if (data[i].vse_label === label) {
                    vseValue = $scope.parseVseValue(data[i].vse_value, data[i].vse_type);

                    //vseCreatedTimestamp = Date.parse(data[i].created_datetime);
                    vseCreated = $scope.parseDate(data[i].created_datetime);
                    vseValues.unshift([vseCreated, vseValue]);

                }
            }
            result.data = vseValues;
        }
        return result;
    };

    $scope.update = function () {
        $scope.plot.setData($scope.dataToDraw);
        $scope.plot.draw();
    };

    $scope.updateWidgets = function () {
        $scope.lastValueWidgetUpdate = [];
        if ($scope.offAndOn) {
            $scope.offAndOn.requestData();
        }
        if ($scope.charts && $scope.charts.length > 0) {
            for (var i = 0; i < $scope.charts.length; ++i) {
                $scope.charts[i].requestData();
            }
        }
        $scope.updateLastValues()
    };

    $scope.getNextWidgetId = function (widgetType, id) {
        var widgetId = -1;
        var findWidgetId = parseInt(id);
        if ($scope.page && $scope.page.widgets) {
            for (var i = 0; i < $scope.page.widgets.length; ++i) {
                if (!$scope.page.widgets[i].wasCreated && widgetType === $scope.page.widgets[i].widget_type_id && (!findWidgetId || $scope.page.widgets[i].widget_id === findWidgetId)) {
                    $scope.page.widgets[i].wasCreated = true;
                    widgetId = $scope.page.widgets[i].widget_id;
                    break;
                }
            }
        }
        return widgetId;
    };

    $scope.checkedWidgetId = function (id) {
        var findWidgetId = parseInt(id);
        if ($scope.page && $scope.page.widgets) {
            for (var i = 0; i < $scope.page.widgets.length; ++i) {
                if ($scope.page.widgets[i].widget_id === findWidgetId) {
                    $scope.page.widgets[i].wasCreated = true;
                    break;
                }
            }
        }
    };

    $scope.getTitleByWidgetId = function (widgetId) {
        var title = "";
        if ($scope.page && $scope.page.widgets) {
            for (var i = 0; i < $scope.page.widgets.length; ++i) {
                if ($scope.page.widgets[i].widget_id === widgetId) {
                    title = $scope.page.widgets[i].title;
                    break;
                }
            }
        }
        return title;
    };

    $scope.getRefreshFrequencyByWidgetId = function (widgetId) {
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

    $scope.processDataByLabels = function (dataList, widgetId) {
        var widget = $scope.findWidgetById(widgetId);
        var result = [];
        if (widget && widget.widget_configs) {
            for (var i = 0; i < widget.widget_configs.length; ++i) {
                if (widget.widget_configs[i].vse_label) {
                    var dataResult = $scope.copyDataLabelForPlot(dataList, widget.widget_configs[i].vse_label, widgetId);
                    if (dataResult) {
                        result.push(dataResult);
                    }
                }
            }
        }
        return result;
    };

    $scope.mergeWithLastData = function (newData) {

        // POINTS 60 
        if (!newData || newData.length === 0) {
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

    $scope.getChartTitle = function () {
        if (!$scope.chartTitle) {
            for (var i = 0; i < $scope.charts; i++) {
                $scope.chartTitle = $scope.charts[i];
                break;
            }
        }
        return $scope.chartTitle;
    };

    $scope.getOffAndOnTitle = function () {
        if (!$scope.offAndOnTitle) {
            for (var i = 0; i < $scope.offAndOns; i++) {
                if ($scope.offAndOns[i].title) {
                    $scope.offAndOnTitle = $scope.offAndOns[i].title;
                    break;
                }
            }
        }
        return $scope.offAndOnTitle;
    };

    $scope.updateChiller = function (event) {
        var v = 0;
        if (event && event.toElement && event.toElement.value) {
            v = $scope.translateToBoolean(event.toElement.checked);
        }

        $scope.addValue("CHILLER", v, "BOOLEAN");
        $scope.chillerOn = event.toElement.checked;

    };

    $scope.translateToBoolean = function (v) {
        if (v) {
            return 1;
        } else if (!v) {
            return 0;
        }
        $scope.chillerOn = event.toElement.checked;
        return 0;
    };

    $scope.updatePump = function (event) {

        var v = 0;
        if (event && event.toElement && event.toElement.value) {
            v = $scope.translateToBoolean(event.toElement.checked);
        }

        $scope.addValue("PUMP", v, "BOOLEAN");
        $scope.pumpOn = event.toElement.checked;
    };

    $window.FlotChart = function (element, widgetId) {
        // Properties
        this.element = $(element);
        this.widgetId = widgetId;
        this.refreshFrequency = null;
        this.last_entry_id = 0;
        this.title = null;

        // Public method
        this.requestData = function () {

            var self = this;
            if (this.widgetId === -1) {
                this.widgetId = $scope.getNextWidgetId(WIDGET_TYPE_CHARTING, "");
            }
            if (!this.title) {
                this.title = $scope.getTitleByWidgetId(this.widgetId);
                $scope.chartTitle = this.title;
            }
            if (!this.refreshFrequency) {
                $scope.updateInterval = $scope.getRefreshFrequencyByWidgetId(this.widgetId);
                this.refreshFrequency = $scope.updateInterval;
            } else {
                $scope.updateInterval = this.refreshFrequency;
            }

            vseWidgetValuesService.GetWidgetValues(this.widgetId, this.last_entry_id, $scope.MAX_LIMIT, $scope.app.app_id, $scope.accountId, $scope.token, $scope.app.api_key).$promise.then(function (response) {
                UtilityService.ProcessServiceResponse(response,
                        function success(response) {
                            console.log("SUCCESS @ page");
                            if (response.data && response.data.length > 0) {
                                $scope.currentResponseData = response.data;

                                $scope.labelValues = $scope.mergeWithLastData($scope.currentResponseData);
                                if ($scope.labelValues && $scope.labelValues.length > 0) {
                                    self.last_entry_id = $scope.labelValues[0].entry_id;
                                }
                                $scope.dataToDraw = $scope.processDataByLabels($scope.labelValues, self.widgetId);
                                if (!$scope.plot) {
                                    $scope.plot = $.plot(self.element, $scope.dataToDraw, $scope.option);
                                } else {
                                    $.plot(self.element, $scope.dataToDraw, $scope.option);
                                }

                            }
                            setTimeout($scope.updateWidgets, $scope.updateInterval);
                        },
                        function error(response) {
                            console.log("ERROR @ page " + response);
                            setTimeout($scope.updateWidgets, $scope.updateInterval);
                            $location.path("/");

                        },
                        function exception(response) {
                            console.log("EXCEPTION @ page");
                            setTimeout($scope.updateWidgets, $scope.updateInterval);
                            console.log("Disculpas por la interrupción. Ocurrió un problema.");
                            $location.path("/");
                        });
            });

            return this; // chain-ability

        };

        // Listen to refresh events
        this.listen = function () {
            var self = this,
                    chartPanel = this.element.parents('.panel').eq(0);

            // attach custom event
            chartPanel.on('panel-refresh', function (event, panel) {
                // request data and remove spinner when done
                self.requestData(self.option, function () {
                    panel.removeSpinner();
                });

            });

            return this; // chain-ability
        };

    };

    $scope.addValue = function (label, value, type) {
        function success(response) {
            console.log("SUCCESS @ ADD VALUE");
        }
        ;
        function error(response) {
            console.log("ERROR @ add value " + response);
            $location.path("/");
        }
        ;
        function exception(response) {
            console.log("EXCEPTION @ add value");
            alert("Disculpas por la interrupción. Ocurrió un problema.");
            $location.path("/");
        }
        ;
        addVseValueService.AddValue1(label, value, type, $scope.app.app_id, $scope.accountId, $scope.token, $scope.app.api_key, success, error);


    };

    $scope.findVseLastValue = function (label) {
        var result = null;
        if (!$scope.lastValueVse || $scope.lastValueVse.length === 0) {
            return result;
        }

        for (var i = 0; i < $scope.lastValueVse.length; ++i) {
            if ($scope.lastValueVse[i].vse_label === label) {
                result = $scope.lastValueVse[i];
                break;
            }

        }
        return result;
    };

    $scope.updateLastValueVse = function (label, niceLabel, value) {

        var objectVse = {};
        var obj = $scope.findVseLastValue(label);
        if (!obj) {
            objectVse = {vse_label: label, friendly_label: niceLabel, vse_value: value};
            $scope.lastValueVse.push(objectVse);

        } else {
            objectVse = obj;
            if (value) {
                objectVse.vse_value = value;
            }

        }
        return objectVse;
    };

    $scope.getLastValue = function (label, niceLabel) {
        $scope.updateLastValueVse(label, niceLabel, null);
        vseLastValueService.GetValue(label, $scope.app.app_id, $scope.accountId, $scope.token, $scope.app.api_key).$promise.then(function (response) {
            UtilityService.ProcessServiceResponse(response,
                    function success(response) {
                        console.log("SUCCESS @ get LAST VALUE");
                        //$scope.lastValueVse.push(response.data);
                        $scope.updateLastValueVse(response.data.vse_label, null, response.data.vse_value);

                    },
                    function error(response) {
                        console.log("ERROR @ get last value " + response);
                        $location.path("/");
                    },
                    function exception(response) {
                        console.log("EXCEPTION @ get last value");
                        alert("Disculpas por la interrupción. Ocurrió un problema.");
                        $location.path("/");
                    });
        });
    };

    $scope.updateWidgetConfigsVSE = function (widget) {
        if (!widget.widget_configs || widget.widget_configs.length <= 0) {
            return;
        }


        for (var i = 0; i < widget.widget_configs.length; ++i) {
            if (widget.widget_configs[i].vse_label) {
                $scope.getLastValue(widget.widget_configs[i].vse_label, widget.widget_configs[i].friendly_label);
            }

        }

    };

    $scope.updateLastValues = function () {
        $scope.lastValueVse = [];
        for (var i = 0; i < $scope.page.widgets.length; ++i) {
            if ($scope.page.widgets[i].widget_type_id === WIDGET_TYPE_DISPLAY) {
                if (!$scope.isWidgetUpdated($scope.page.widgets[i].widget_id)) {
                    $scope.lastValueWidgetUpdate.push(parseInt($scope.page.widgets[i].widget_id));
                    $scope.updateWidgetConfigsVSE($scope.page.widgets[i])
                }
            }
        }


    };

    $scope.updateOffAndOnValues = function (data) {
        if (data.entry_id) {
            if (data.vse_value && data.vse_value === "1") {
                if (data.vse_label === "CHILLER") {
                    $scope.chillerOn = true;
                } else {
                    $scope.pumpOn = true;
                }
            } else {
                if (data.vse_label === "CHILLER") {
                    $scope.chillerOn = false;
                } else {
                    $scope.pumpOn = false;
                }
            }


        } else {
            if (data.vse_label === "CHILLER") {
                $scope.chillerOn = false;
            } else {
                $scope.pumpOn = false;
            }
        }
    };

    $window.OffAndOn = function (element, widgetId, checked) {
        // Properties
        this.element = $(element);
        this.widgetId = widgetId;
        this.refreshFrequency = null;
        this.label = "";
        this.title = "";
        this.widgetIdChecked = checked;

        this.getLastValue = function (label) {

            vseLastValueService.GetValue(label, $scope.app.app_id, $scope.accountId, $scope.token, $scope.app.api_key).$promise.then(function (response) {
                UtilityService.ProcessServiceResponse(response,
                        function success(response) {
                            console.log("SUCCESS @ get LAST VALUE");
                            $scope.updateOffAndOnValues(response.data);

                        },
                        function error(response) {
                            console.log("ERROR @ get last value " + response);
                            $location.path("/");
                        },
                        function exception(response) {
                            console.log("EXCEPTION @ get last value");
                            alert("Disculpas por la interrupción. Ocurrió un problema.");
                            $location.path("/");
                        });
            });
        }

        // Public method
        this.requestData = function () {
            var self = this;
            if (this.widgetId === -1) {
                this.widgetId = $scope.getNextWidgetId(WIDGET_TYPE_DISPLAY);
                this.widgetIdChecked = true;

            } else if (!this.widgetIdChecked) {
                $scope.checkedWidgetId(this.widgetId);
                this.widgetIdChecked = true;
            }

            if (!this.title) {
                this.title = $scope.getTitleByWidgetId(this.widgetId);
                $scope.offAndOnTitle = this.title;
            }

            var widget = $scope.findWidgetById(this.widgetId);
            if (!widget) {
                return;
            }
            if ($scope.isWidgetUpdated(this.widgetId)) {
                return;
            } else {
                $scope.lastValueWidgetUpdate.push(parseInt(this.widgetId));
            }
            for (var i = 0; i < widget.widget_configs.length; ++i) {
                if (widget.widget_configs[i].vse_label) {
                    this.getLastValue(widget.widget_configs[i].vse_label);
                }

            }
            return this; // chain-ability

        };

        // Listen to refresh events
        this.listen = function () {
            var self = this,
                    chartPanel = this.element.parents('.panel').eq(0);

            // attach custom event
            chartPanel.on('panel-refresh', function (event, panel) {
                // request data and remove spinner when done
                self.requestData(self.option, function () {
                    panel.removeSpinner();
                });

            });

            return this; // chain-ability
        };

    };

    $scope.requestDataForPendings = function () {
        for (var i = 0; i < $scope.charts.length; ++i) {
            if ($scope.charts[i].pendingToRequestData) {
                $scope.charts[i].requestData();
            }
        }
    };

    $scope.initAppById = function () {
        AppRegistryService.GetAppByID($scope.accountId, $scope.token, $scope.page.app_id).$promise.then(function (response) {
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

    $scope.initPageData = function () {
        PageService.GetPage($scope.accountId, $scope.token, $scope.pageId).$promise.then(function (response) {
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
    };

    $scope.parseDate = function (s) {
        //2015-07-22 20:01:50
        var re = /^(\d{4})-(\d\d)-(\d\d) (\d\d):(\d\d):(\d\d)$/;
        var m = re.exec(s);
        return m ? new Date(m[1], m[2] - 1, m[3], m[4], m[5], m[6]) : null;

    };

    angular.element(document).ready(function () {

        // Area chart
        (function () {
            var Selector = '.chart-line';
            $(Selector).each(function () {
                $scope.chart = new FlotChart(this, $scope.getNextWidgetId(WIDGET_TYPE_CHARTING));

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
                        tickSize: [2, "second"],
                        tickFormatter: function (v, axis) {
                            var date = new Date(v);
                            if (date.getSeconds() % 60 == 0) {
                                var hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
                                var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
                                var seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();

                                return hours + ":" + minutes + ":" + seconds;
                            } else {
                                return "";
                            }
                        },
                        tickColor: '#eee',
                        mode: 'time',
                        axisLabel: "Time",
                        axisLabelUseCanvas: true,
                        axisLabelFontSizePixels: 12,
                        axisLabelFontFamily: 'Verdana, Arial',
                        axisLabelPadding: 10
                    },
                    yaxis: {
                        axisLabel: "Kilowatts",
                        position: 'left',
                        tickFormatter: function (v, axis) {
                            return v + "Kw";

                        },
                        axisLabelUseCanvas: true,
                        axisLabelFontSizePixels: 12,
                        axisLabelFontFamily: 'Verdana, Arial',
                        axisLabelPadding: 6,
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

            });
        })();

        (function () {
            var Selector = '.offon-values';
            $(Selector).each(function () {
                var checked = false;
                if (!this.id) {
                    this.id = $scope.getNextWidgetId(WIDGET_TYPE_DISPLAY, "");
                    if (this.id) {
                        checked = true;
                    }
                }
                $scope.offAndOn = new OffAndOn(this, this.id, checked);
                $scope.offAndOns.push($scope.offAndOn);
                if ($scope.page && $scope.app) {
                    $scope.offAndOn.pendingToRequestData = false;
                    $scope.offAndOn.requestData().listen();
                } else {
                    $scope.offAndOn.pendingToRequestData = true;
                }
            });
        })();
    });
});