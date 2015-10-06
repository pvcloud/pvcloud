/**
 * Function to be called by the system when everything is ready @ browser. 
 */
$(document).ready(function () {
    configureEvents();
});

/**
 * Configures behavior of each actionable control in the page.
 * @returns {undefined}
 */
function configureEvents() {
    console.log("CONFIGURE EVENTS");

    GetSensorsStatus();
    GetAlarmCondition();
    GetOPModeFromPVCloud();
    GetLastEvents();

    function showLoading() {
        $("#spnLoader_Control").show();
        $("#lblCurrentOPMode").hide();
    }

    function hideLoading() {
        $("#spnLoader_Control").hide();
        $("#lblCurrentOPMode").show();
        OPModeUpdateInProgress = false;
        GetOPModeFromPVCloud();
    }

    $("#btnMode_SETUP").click(function () {
        showLoading();
        var button = this;
        button.blur();
        OPModeUpdateInProgress = true;
        clearTimeout(timeouthandler);
        pvCloud_WRITE("OPMODE", "SETUP", function (data) {
            hideLoading(data);
        });
    });

    $("#btnMode_ACTIVE,#btnMode_ACTIVE2").click(function () {
        showLoading();
        var button = this;
        button.blur();
        OPModeUpdateInProgress = true;
        clearTimeout(timeouthandler);
        pvCloud_WRITE("OPMODE", "ACTIVE", function (data) {
            hideLoading(data);
        });
    });

    $("#btnMode_OFF").click(function () {
        showLoading();
        var button = this;
        button.blur();
        OPModeUpdateInProgress = true;
        clearTimeout(timeouthandler);
        pvCloud_WRITE("OPMODE", "OFF", function (data) {
            hideLoading(data);
        });
    });

    $("#btnMode_NOBODY").click(function () {
        showLoading();
        var button = this;
        button.blur();
        OPModeUpdateInProgress = true;
        clearTimeout(timeouthandler);
        pvCloud_WRITE("OPMODE", "NOBODY", function (data) {
            hideLoading(data);
        });
    });

    $("#btnMode_PANIC").click(function () {
        showLoading();
        var button = this;
        button.blur();
        OPModeUpdateInProgress = true;
        clearTimeout(timeouthandler);
        pvCloud_WRITE("OPMODE", "PANIC", function (data) {
            hideLoading(data);
        });
    });

    $("#btnMode_SLEEP").click(function () {
        showLoading();
        var button = this;
        button.blur();
        OPModeUpdateInProgress = true;
        clearTimeout(timeouthandler);
        pvCloud_WRITE("OPMODE", "PANIC", function (data) {
            hideLoading(data);
        });
    });

    $("#btnMode_CHILDCARE").click(function () {
        showLoading();
        var button = this;
        button.blur();
        OPModeUpdateInProgress = true;
        clearTimeout(timeouthandler);
        pvCloud_WRITE("OPMODE", "PANIC", function (data) {
            hideLoading(data);
        });
    });

    $("#btnMode_VACATIONS").click(function () {
        showLoading();
        var button = this;
        button.blur();
        OPModeUpdateInProgress = true;
        clearTimeout(timeouthandler);
        pvCloud_WRITE("OPMODE", "PANIC", function (data) {
            hideLoading(data);
        });
    });


    var timeouthandler = null;
    var OPModeUpdateInProgress = false;
    function GetOPModeFromPVCloud() {
        if (!OPModeUpdateInProgress) {
            $("#imgLoader_Control2").show();
            pvCloud_READ("OPMODE", function (data) {
                $("#spnOPMODE").text(data.vse_value);
                $("#imgLoader_Control2").hide();
                if (!OPModeUpdateInProgress)
                    timeouthandler = setTimeout(GetOPModeFromPVCloud, 5000);
            });
        }
    }

    function GetSensorsStatus() {
        $("#imgLoader_Control3").show();
        pvCloud_READ("SENSORS_LINE", function (data) {

            var curSensor = 0;
            var curSensorID = "#div_Sensor" + curSensor;
            var curSensorElement = $(curSensorID);

            $(curSensorElement).removeClass("tombo-sensor-red");
            $(curSensorElement).removeClass("tombo-sensor-green");
            $(curSensorElement).removeClass("tombo-sensor-gray");
            if (data.vse_value[curSensor] === "1") {
                $(curSensorElement).addClass("tombo-sensor-red");
            } else if (data.vse_value[curSensor] === "0") {
                $(curSensorElement).addClass("tombo-sensor-green");
            } else {
                $(curSensorElement).addClass("tombo-sensor-gray");
            }

            curSensor++;
            curSensorID = "#div_Sensor" + curSensor;
            curSensorElement = $(curSensorID);

            $(curSensorElement).removeClass("tombo-sensor-red");
            $(curSensorElement).removeClass("tombo-sensor-green");
            $(curSensorElement).removeClass("tombo-sensor-gray");
            if (data.vse_value[curSensor] === "1") {
                $(curSensorElement).addClass("tombo-sensor-red");
            } else if (data.vse_value[curSensor] === "0") {
                $(curSensorElement).addClass("tombo-sensor-green");
            } else {
                $(curSensorElement).addClass("tombo-sensor-gray");
            }


            curSensor++;
            curSensorID = "#div_Sensor" + curSensor;
            curSensorElement = $(curSensorID);

            $(curSensorElement).removeClass("tombo-sensor-red");
            $(curSensorElement).removeClass("tombo-sensor-green");
            $(curSensorElement).removeClass("tombo-sensor-gray");
            if (data.vse_value[curSensor] === "1") {
                $(curSensorElement).addClass("tombo-sensor-red");
            } else if (data.vse_value[curSensor] === "0") {
                $(curSensorElement).addClass("tombo-sensor-green");
            } else {
                $(curSensorElement).addClass("tombo-sensor-gray");
            }

            curSensor++;
            curSensorID = "#div_Sensor" + curSensor;
            curSensorElement = $(curSensorID);

            $(curSensorElement).removeClass("tombo-sensor-red");
            $(curSensorElement).removeClass("tombo-sensor-green");
            $(curSensorElement).removeClass("tombo-sensor-gray");
            if (data.vse_value[curSensor] === "1") {
                $(curSensorElement).addClass("tombo-sensor-red");
            } else if (data.vse_value[curSensor] === "0") {
                $(curSensorElement).addClass("tombo-sensor-green");
            } else {
                $(curSensorElement).addClass("tombo-sensor-gray");
            }



            $("#imgLoader_Control3").hide();
            setTimeout(GetSensorsStatus, 3000);
        });
    }

    function GetAlarmCondition() {
        $("#imgLoader_Control3").show();
        pvCloud_READ("ALARM_CONDITION", function (data) {
            if (data && data.vse_value) {
                var alarmCondition = data.vse_value;
                if (alarmCondition == "PANIC") {
                    $("#spn_status").text("PANIC ALARM");
                    $("#div_AlarmCondition").css("color", "red");
                } else if (alarmCondition == "QUIET") {
                    $("#spn_status").text("FINE");
                    $("#div_AlarmCondition").css("color", "green");
                } else {
                    $("#spn_status").text("UNKNOWN" + alarmCondition);
                    $("#div_AlarmCondition").css("color", "orange");
                }
            }

            $("#imgLoader_Control3").hide();

            setTimeout(GetAlarmCondition, 3000);
        });
    }

    function GetLastEvents() {
        $("#imgLoader_Control4").show();
        pvCloud_READ_LIST("", 30, function (data) {
            console.log(data);
            var totalHTML = "";
            $(data).each(function (index, element) {

                var text = "";
                if (element.vse_label === "SENSORS_LINE") {
                    var icons = "";
                    for (i = 0; i < 4; i++) {
                        var color = element.vse_value[i] === "1" ? "red" : "green";

                        switch (i) {
                            case 0:
                                icons += '&nbsp;<span class="badge"><i class="glyphicon glyphicon-user" style="color:' + color + '"></i></span>';
                                break;
                            case 1:
                                icons += '&nbsp;<span class="badge"><i class="glyphicon glyphicon-tree-deciduous" style="color:' + color + '"></i></span>';
                                break;
                            case 2:
                                icons += '&nbsp;<span class="badge"><i class="glyphicon glyphicon-bell" style="color:' + color + '"></i></span>';
                                break;
                            case 3:
                                icons += '&nbsp;<span class="badge"><i class="glyphicon glyphicon-eye-open" style="color:' + color + '"></i></span>';
                        }

                    }

                    text = element.created_datetime + " | SENSORS STATUS CHANGED: " + icons;
                } else {

                    text = element.created_datetime + " | " + element.vse_label + ": " + element.vse_value;
                }


                var alert_class = "";
                if (element.vse_label === "ALARM_CONDITION" && element.vse_value === "PANIC") {
                    alert_class = "alert-danger";
                } else if (element.vse_label === "ALARM_CONDITION" && element.vse_value === "QUIET") {
                    alert_class = "alert-success";
                } else if (element.vse_label === "OPMODE") {
                    alert_class = "alert-warning";
                } else {
                    alert_class = "alert-info";
                }


                var htmlCode = '<div class="alert ' + alert_class + '">' + text + '</div>';

                totalHTML += htmlCode;
            });

            $("#panelEvents").html(totalHTML);

            $("#imgLoader_Control4").hide();
            setTimeout(GetLastEvents, 3000);
        });

    }
}


/**
 * Actually pefroms a Web Service Call to pvCloud to retrieve last value registered for the app.
 * 
 * @param {type} label
 * @param {type} callback
 * @returns {undefined}
 */
function pvCloud_READ(label, callback) { /** /   Llamada en el browser, todo en el main.js */
    var url = "ws_GetPVCloudData.php?label=" + label;

    $.ajax(url, {/** /Utiliza el url y hace que el browser llame a PVCloud, asincronica, no se detiene ahi, sigue llamando*/
        success: function (data) { /** /Data son los datos de PVCloud */
            console.log(data);
            callback(data); /** / Cuando tiene el dato, hace el callback y devuelve la info GetPVCLOUDValue, si no hay valores data es null  */
        },
        error: function (error) { /** / Error de comunicacion  */
            console.log(error);
            return null;
        }
    });
}

function pvCloud_READ_LIST(label, limit, callback) { /** /   Llamada en el browser, todo en el main.js */
    var url = "ws_GetPVCloudDataList.php?label=" + label + "&optional_last_limit=" + limit;


    $.ajax(url, {/** /Utiliza el url y hace que el browser llame a PVCloud, asincronica, no se detiene ahi, sigue llamando*/
        success: function (data) { /** /Data son los datos de PVCloud */
            console.log(data);
            callback(data); /** / Cuando tiene el dato, hace el callback y devuelve la info GetPVCLOUDValue, si no hay valores data es null  */
        },
        error: function (error) { /** / Error de comunicacion  */
            console.log(error);
            return null;
        }
    });
}


function pvCloud_WRITE(label, value, callback) { /** /   Llamada en el browser, todo en el main.js */
    var url = "ws_SetPVCloudData.php?label=" + label + "&value=" + value;

    $.ajax(url, {/** /Utiliza el url y hace que el browser llame a PVCloud, asincronica, no se detiene ahi, sigue llamando*/
        success: function (data) { /** /Data son los datos de PVCloud */
            console.log(data);
            callback(data); /** / Cuando tiene el dato, hace el callback y devuelve la info GetPVCLOUDValue, si no hay valores data es null  */
        },
        error: function (error) { /** / Error de comunicacion  */
            console.log(error);
            return null;
        }
    });
}