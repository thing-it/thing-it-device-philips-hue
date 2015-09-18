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
    }
};

var q = require('q');
var hue;

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

            hue.nupnpSearch().then(function (bridges) {
                for (var n in bridges) {
                    hue.registerUser(bridges[n], "[thing-it] Node", "[thing-it] Node Default User")
                        .then(function () {
                            var hueBridge = new HueBridge();

                            hueBridge.hueApi = hue.HueApi(bridges[n], "[thing-it] Node");
                            hueBridge.id = bridges[n].id;

                            break;
                        }.bind(this))
                        .fail(function () {
                        }.bind(this));
                }
            }.bind(this)).fail();
        }
    };

    /**
     *
     * @param options
     */
    HueBridgeDiscovery.prototype.stop = function () {
    };
}

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

            console.log("************ Hue retrieved");

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
