var index = require("../index.js");
console.log("TEST POINT REACHED");
console.log(index);
index.iLib.hello();

describe("iLib Library", function () {
    it("can say hello", function () {
        expect(1).toBe(0);
    });
});
