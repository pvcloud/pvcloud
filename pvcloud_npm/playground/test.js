var index = require("./index.js");
var jasmine = require("jasmine");
console.log("TEST POINT REACHED");
console.log(index);
index.iLib.hello();

describe("iLib Library", function () {
    it("can say hello", function () {
        index.iLib.hello();
        
        expect(1).toBe(1);
    });
});
