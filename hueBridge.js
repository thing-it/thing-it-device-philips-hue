module.exports = {
    metadata: {
        family: "philips-hue",
        plugin: "hueBridge",
        label: "Philips Hue Bridge",
        manufacturer: "Philips",
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
