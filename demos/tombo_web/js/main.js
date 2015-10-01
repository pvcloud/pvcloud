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
    function disableButtons() {

    }

    function paintProcessing() {

    }

    function paintCurrentOPMode(data) {
        alert("COMPLETE");
    }

    $("#btnMode_SETUP").click(function () {
        disableButtons();
        paintProcessing();

        pvCloud_WRITE("OPMODE", "SETUP", function (data) {
            paintCurrentOPMode(data);
        });
    });

    $("#btnMode_ACTIVE, #btnMode_ACTIVE2").click(function () {
        disableButtons();
        paintProcessing();

        pvCloud_WRITE("OPMODE", "ACTIVE", function (data) {
            paintCurrentOPMode(data);
        });
    });

    $("#btnMode_OFF").click(function () {
        disableButtons();
        paintProcessing();

        pvCloud_WRITE("OPMODE", "OFF", function (data) {
            paintCurrentOPMode(data);
        });
    });

    $("#btnMode_NOBODY").click(function () {
        disableButtons();
        paintProcessing();

        pvCloud_WRITE("OPMODE", "NOBODY", function (data) {
            paintCurrentOPMode(data);
        });
    });

    $("#btnMode_PANIC").click(function () {
        disableButtons();
        paintProcessing();

        pvCloud_WRITE("OPMODE", "PANIC", function (data) {
            paintCurrentOPMode(data);
        });
    });

    $("#btnMode_SLEEP").click(function () {
        disableButtons();
        paintProcessing();

        pvCloud_WRITE("OPMODE", "PANIC", function (data) {
            paintCurrentOPMode(data);
        });
    });

    $("#btnMode_CHILDCARE").click(function () {
        disableButtons();
        paintProcessing();

        pvCloud_WRITE("OPMODE", "PANIC", function (data) {
            paintCurrentOPMode(data);
        });
    });

    $("#btnMode_VACATIONS").click(function () {
        disableButtons();
        paintProcessing();

        pvCloud_WRITE("OPMODE", "PANIC", function (data) {
            paintCurrentOPMode(data);
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
function pvCloud_READ(label, callback) { /** /   Llamada en el browser, todo en el main.js */
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