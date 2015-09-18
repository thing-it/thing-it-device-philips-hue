var hue = require("node-hue-api");

var displayBridges = function (bridge) {
    console.log("Hue Bridges Found: " + JSON.stringify(bridge));
};

//hue.nupnpSearch().then(displayBridges).done();

//var hueApi = hue.HueApi("192.168.1.4");

//new hue.HueApi().registerUser("192.168.1.4", "zorg")
//    .then(function (user) {
//        console.log("************ User", user);
//    })
//    .fail(function (error) {
//        console.log("************ Error", error);
//    })
//    .done();

var hueApi = hue.HueApi("192.168.1.4", "2752a546106c35443652a19216b6953f");

console.log("************ Hue retrieved");

hueApi.lights()
    .then(function (result) {
        console.log(JSON.stringify(result, null, 2));
    })
    .done();

hueApi.setLightState(2, hue.lightState.create().brightness(100)).then(function () {
    console.log("************ Light on");
}.bind(this)).fail(function () {
    console.log("************ Fail");
});


