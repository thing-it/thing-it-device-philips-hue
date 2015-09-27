var hue = require("node-hue-api");
var sleep = require('sleep');

console.log("Scanning network for Hue Bridges");

hue.nupnpSearch().then(function (bridges) {
    console.log("Hue Bridges Found", bridges);

    var hueApi = hue.HueApi(bridges[0].ipaddress);

    console.log("Anonymous Hue retrieved", hueApi);

    hueApi.registerUser(bridges[0].ipaddress, "thing-it", "[thing-it] Node Default User")
        .then(function (user) {
            console.log("User", user);

            var hueApi = hue.HueApi(bridges[0].ipaddress, user);

            console.log("Hue for user retrieved", hueApi);

            hueApi.lights()
                .then(function (lights) {
                    console.log("Lights", lights);
                })
                .done();

            hueApi.setLightState(2, hue.lightState.create().brightness(0)).then(function () {
                console.log("Light 2 off");
                sleep.sleep(5);

                hueApi.setLightState(2, hue.lightState.create().brightness(0/*100*/)).then(function () {
                    console.log("Light 2 on");

                    hueApi.setLightState(3, hue.lightState.create().brightness(0)).then(function () {
                        console.log("Light 3 off");
                        sleep.sleep(5);

                        hueApi.setLightState(3, hue.lightState.create().brightness(100)).then(function () {
                            console.log("Light 3 on");
                            sleep.sleep(5);

                            hueApi.setLightState(3, hue.lightState.create().rgb(255, 0, 0)).then(function () {
                                console.log("Light 3 red");
                                sleep.sleep(5);

                                hueApi.setLightState(3, hue.lightState.create().rgb(0, 255, 0)).then(function () {
                                    console.log("Light 3 green");
                                    sleep.sleep(5);

                                    hueApi.setLightState(3, hue.lightState.create().rgb(0, 0, 255)).then(function () {
                                        console.log("Light 3 blue");
                                    }.bind(this)).fail(function (error) {
                                        console.log(error);
                                    });
                                }.bind(this)).fail(function (error) {
                                    console.log(error);
                                });
                            }.bind(this)).fail(function (error) {
                                console.log(error);
                            });
                        }.bind(this)).fail(function (error) {
                            console.log(error);
                        });
                    }.bind(this)).fail(function (error) {
                        console.log(error);
                    });
                }.bind(this)).fail(function (error) {
                    console.log(error);
                });
            }.bind(this)).fail(function (error) {
                console.log(error);
            });
        })
        .fail(function (error) {
            console.log(error);
        })
        .done();
}.bind(this)).done();





