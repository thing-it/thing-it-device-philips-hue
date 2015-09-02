module.exports = {
    metadata: {
        plugin: "lightBulb",
        label: "Light Bulb",
        role: "actor",
        family: "lightBulb",
        deviceTypes: ["philips-hue/hueBridge"],
        services: [{
            id: "on",
            label: "On"
        }, {
            id: "off",
            label: "Off"
        }, {
            id: "blink",
            label: "Blink"
        }, {
            id: "setIntensity",
            label: "Set Intensity"
        }],
        state: [{
            id: "blink",
            label: "Blink",
            type: {
                id: "boolean"
            }
        }, {
            id: "intensity",
            label: "Intensity",
            type: {
                id: "integer"
            }
        }],
        configuration: [{
            label: "ID",
            id: "id",
            type: {
                id: "integer"
            },
            defaultValue: "1"
        }]
    },
    create: function () {
        return new LightBulb();
    }
};

var q = require('q');

/**
 *
 */
function LightBulb() {
    /**
     *
     */
    LightBulb.prototype.start = function () {
        var deferred = q.defer();

        this.state = {
            blink: false,
            intensity: 0
        };

        if (!this.isSimulated()) {
            try {
            } catch (error) {
            }
        }

        deferred.resolve();

        return deferred.promise;
    };

    /**
     *
     */
    LightBulb.prototype.getState = function () {
        return this.state;
    };

    /**
     *
     */
    LightBulb.prototype.setState = function (state) {
        this.state = state;

        this.publishStateChange();
    };

    /**
     *
     */
    LightBulb.prototype.on = function () {
        this.state.intensity = 255;

        this.publishStateChange();
    };

    /**
     *
     */
    LightBulb.prototype.off = function () {
        this.state.intensity = 0;

        this.publishStateChange();
    };

    /**
     *
     */
    LightBulb.prototype.setIntensity = function (parameters) {
        this.state.intensity = parameters.intensity;

        this.publishStateChange();
    };

    /**
     *
     */
    LightBulb.prototype.blink = function () {
        this.state.blink = true;

        this.publishStateChange();
    };
};
