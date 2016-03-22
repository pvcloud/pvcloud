var request = require("request");
var pvcloud_cli = require("../index.js");
var infoStep = 0;
var settings = {
    baseURL: "http://crmakers.intel.com:8080/pvcloud_test/"
};

pvcloud_cli = pvcloud_cli.Client;


describe("pvCloud CLI Object", function () {
    info("CLI OBJECT TEST");

    it("Must not be empty", function () {
        info("CHECKING ITS NOT EMPTY");
        expect(pvcloud_cli).not.toBe(undefined);

        info(pvcloud_cli);
    });

    it("Must be able to initialize", function () {
        info("Check Initialization");
        var parameters = {
            base_url: settings.baseURL,
            username:"test@costaricamakers.com",
            password:"abcd",
            app_descriptor: "TEST_APP"
        };
        pvcloud_cli.Init(parameters);
    });
});



/*******************************************************************************
 * UTILITARY FUNCTIONS BELOW
 *******************************************************************************/

function info(message) {
    infoStep++;
    console.log("-------------------------------------------");
    var dt = getFormattedDateTime();
    if (typeof message == "object") {
        console.log("INFO (" + infoStep + " - " + dt + ") : -------------------");
        console.log(message);
    } else {
        console.log("INFO (" + infoStep + " - " + dt + ") :" + message);
    }
}

function getFormattedDateTime() {
    var rawDate = new Date();
    var year = rawDate.getFullYear();
    var month = rawDate.getMonth() + 1;
    var day = rawDate.getDate();
    var hour = rawDate.getHours();
    var minute = rawDate.getMinutes();
    var second = rawDate.getSeconds();
    if (month < 10)
        month = "0" + month;
    if (day < 10)
        day = "0" + day;
    if (hour < 10)
        hour = "0" + hour;
    if (minute < 10)
        minute = "0" + minute;
    if (second < 10)
        second = "0" + second;
    return year + "-" + month + "-" + day + "+" + hour + ":" + minute + ":" + second;
}