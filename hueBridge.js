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
            this.timer = setInterval(function () {
                var hueBridge = new HueBridge();

                hueBridge.configuration = this.defaultConfiguration;
                hueBridge.configuration.host = "test";
                hueBridge.configuration.userName = "test";
                hueBridge.uuid = "09-99-23-56-78";

                hueBridge.actors = [];

                hueBridge.actors.push({
                    id: "lightBulb1", label: "Light Bulb 1", type: "lightBulb",
                    configuration: {
                        id: 1
                    }
                });

                this.logDebug("Bridge with lights", hueBridge);

                this.advertiseDevice(hueBridge);
            }.bind(this), 20000);
        } else {
            if (!hue) {
                hue = require("node-hue-api");
            }

            // TODO For now, need to be able to switch for Discovery or inherit from Device

            this.logLevel = "debug";

            var discovery = this;

            this.timer = setInterval(function () {
                hue.nupnpSearch().then(function (bridges) {
                    for (var n in bridges) {
                        new hue.HueApi(bridges[n].ipaddress).registerUser(bridges[n].ipaddress, "thing-it", "[thing-it] Node Default User")
                            .then(function (user) {
                                this._config.username = user; // Could call constructor again, but it does the same

                                discovery.logDebug("Hue API", this);

                                this.fullState().then(function (bridge) {
                                    var hueBridge = new HueBridge();

                                    hueBridge.configuration = discovery.defaultConfiguration;
                                    hueBridge.configuration.host = this.hostname;
                                    hueBridge.configuration.userName = this.username;
                                    hueBridge.hueApi = this;
                                    hueBridge.uuid = bridge.config.mac;

                                    discovery.logDebug("Initial Bridge", hueBridge);

                                    // TODO Inherit structure from Device. Where is the device bound?

                                    hueBridge.actors = [];

                                    for (var n in bridge.lights) {
                                        hueBridge.actors.push({
                                            id: "light" + n, name: bridge.lights[n].name, type: "lightBulb",
                                            configuration: {
                                                id: n
                                            }
                                        });
                                    }

                                    discovery.logDebug("Bridge with lights", hueBridge);

                                    discovery.advertiseDevice(hueBridge);
                                }).fail(function (error) {
                                    discovery.logError(error);
                                });
                            })
                            .fail(function (error) {
                                discovery.logError(error);
                            });
                    }
                }.bind(this)).fail(function (error) {
                    discovery.logError(error);
                });
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

            this.logDebug("Hue API", this.hueApi);

            deferred.resolve();
        }

        return deferred.promise;
    };

    /**
     *
     */
    HueBridge.prototype.stop = function () {
        var deferred = q.defer();

        deferred.resolve();

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
