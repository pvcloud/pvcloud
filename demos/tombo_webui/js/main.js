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
    $("#btn_SetMode_Setup").click(function () {
        $("#panel-set-mode .btn-info").removeClass("btn-info");
        $("#btn_SetMode_Setup").addClass("btn-success");
        SetPVCLOUDValue("OP_MODE", "SETUP", function (data) {
            $("#btn_SetMode_Setup").removeClass("btn-success").addClass("btn-info").removeClass("btn-link");
            alert("Listo! SETUP");
        });
    });

    $("#btn_SetMode_Active").click(function () {
        $("#panel-set-mode .btn-info").removeClass("btn-info");
        $("#btn_SetMode_Active").addClass("btn-success");
        SetPVCLOUDValue("OP_MODE", "ACTIVE", function (data) {
            $("#btn_SetMode_Active").removeClass("btn-success").addClass("btn-info").removeClass("btn-link");
            alert("Listo! ACTIVE");
        });
    });

    heartbeat();
    
    var currentStatus = "Connecting...";
    function heartbeat() {
        console.log("Heartbeat!");

        $("#spn_status").text(currentStatus);
        
        
        
        setAgain();

        function setAgain() {
            setTimeout(heartbeat, 5000);
        }
    }
}




/**
 * Actually pefroms a Web Service Call to pvCloud to retrieve last value registered for the app.
 * @param {type} callback
 * @returns {undefined}
 */
function GetPVCLOUDValue(label, callback) { /** /   Llamada en el browser, todo en el main.js */
    var url = "ws_GetPVCloudData.php";

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

/**
 * 
 * @param {string} label
 * @param {string} value
 * @param {fuction} callback
 * @returns {undefined}
 */
function SetPVCLOUDValue(label, value, callback) { /** /   Llamada en el browser, todo en el main.js */
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