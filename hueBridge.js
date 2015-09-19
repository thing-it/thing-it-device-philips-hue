module.exports = {
    metadata: {
        family: "philips-hue",
        plugin: "hueBridge",
        label: "Philips Hue Bridge",
        manufacturer: "Philips",
        discoverable: true,
        actorTypes: [],
        sensorTypes: [],
        services: [],
        configuration: [{
            id: "host",
            label: "Host",
            type: {
                id: "string"
            },
            default: "255.255.255.255"
        }, {
            id: "userName",
            label: "User Name",
            type: {
                id: "string"
            }
        }, {
            id: "port",
            label: "Port",
            type: {
                id: "integer"
            },
            default: "8080"
        }, , {
            id: "timeout",
            label: "Timeout",
            type: {
                id: "integer"
            },
            default: "20000"
        }]
    },
    create: function () {
        return new HueBridge();
    },
    discovery: function () {
        return new HueBridgeDiscovery();
    }

};

var q = require('q');
var hue;

/**
 *
 * @constructor
 */
function HueBridgeDiscovery() {
    /**
     *
     * @param options
     */
    HueBridgeDiscovery.prototype.start = function () {
        if (this.node.isSimulated()) {
        } else {
            if (!hue) {
                hue = require("node-hue-api");
            }

            this.timer = setInterval(function () {
                hue.nupnpSearch().then(function (bridges) {
                    for (var n in bridges) {
                        var hueApi = new hue.HueApi(bridges[n].ipaddress);

                        console.log("Attempt to create user for bridge ", bridges[n]);

                        hueApi.registerUser(bridges[n].ipaddress, "thing-it-"/* + new Date().getTime()*/, "[thing-it] Node Default User")
                            .then(function (user) {
                                hueApi._config.username = user; // TODO Ugly/hack?

                                hueApi.fullState().then(function (bridge) {
                                    var hueBridge = new HueBridge();

                                    hueBridge.configuration = this.defaultConfiguration;
                                    hueBridge.configuration.host = bridge.config.ipaddress;
                                    hueBridge.configuration.userName = user;
                                    hueBridge.hueApi = hueApi;
                                    hueBridge.uuid = bridge.config.mac;

                                    // TODO Inherit structure from Device

                                    hueBridge.actors = [];

                                    for (var n in bridge.lights) {
                                        hueBridge.actors.push({
                                            id: "light" + n, name: bridge.lights[n].name, type: "lightBulb",
                                            configuration: {
                                                id: n
                                            }
                                        });
                                    }

                                    console.log("Device", hueBridge);

                                    this.advertiseDevice(hueBridge);
                                }.bind(this));
                            }.bind(this))
                            .fail(function (error) {
                                console.error("Cannot create users: " + error);
                            }.bind(this));

                        break;
                    }

                }.bind(this)).fail();
            }.bind(this), 10000);
        }
    };

    /**
     *
     * @param options
     */
    HueBridgeDiscovery.prototype.stop = function () {
        if (this.timer) {
            clearInterval(this.timer);
        }
    };
}

/**
 *
 * @constructor
 */
function HueBridge() {
    /**
     *
     */
    HueBridge.prototype.start = function () {
        var deferred = q.defer();

        if (this.isSimulated()) {
            deferred.resolve();
        } else {
            if (!hue) {
                hue = require('node-hue-api');
            }

            this.hueApi = hue.HueApi(this.configuration.host, this.configuration.userName);

            deferred.resolve();
        }

        return deferred.promise;
    };

    /**
     *
     */
    HueBridge.prototype.getState = function () {
        return {};
    };

    /**
     *
     */
    HueBridge.prototype.setState = function () {
    };
}
