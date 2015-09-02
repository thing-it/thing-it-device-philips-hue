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
        }]
    },
    create: function () {
        return new HueBridge();
    }
};

var q = require('q');
var hueApi;

function HueBridge() {
    /**
     *
     */
    HueBridge.prototype.start = function () {
        var deferred = q.defer();

        if (this.isSimulated()) {
            deferred.resolve();
        } else {
            if (!hueApi) {
                hueApi = require('node-hue-api').HueApi;
            }

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
