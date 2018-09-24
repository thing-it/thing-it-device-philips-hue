module.exports = {
    metadata: {
        plugin: "roomScenes",
        label: "Room Scenes",
        role: "actor",
        family: "roomScenes",
        deviceTypes: ["philips-hue/hueBridge"],
        services: [{
            id: "on",
            label: "On"
        }, {
            id: "off",
            label: "Off"
        }, {
            id: "toggle",
            label: "Toggle"
        }],
        state: [{
            label: "Scenes",
            id: "scenes",
            type: {
                id: "any"
            }
        }, {
            label: "Activated Scene",
            id: "activatedScene",
            type: {
                id: "string"
            }
        }],
        configuration: [{
            label: "Room",
            id: "room",
            type:{
                id: "string"
            }
        }]
    },
    create: function () {
        return new RoomScenes();
    }
};

var q = require('q');
var hue = require('node-hue-api');
var _ = require('lodash');

function RoomScenes(){
    /**
     *
     */
    RoomScenes.prototype.start = function(){
        var deferred = q.defer();

        if (!this.isSimulated()){

            this.newScenes = [];

            this.state = {
                scenes: []
            };

            if (this.configuration.room) {

                let group = _.find(this.state.rooms, (group) => {
                    if (group && group.id === this.configuration.room) {
                        return group;
                    }
                });

                this.device.hueApi.scenes().then((scenes) => {
                    this.state.scenes = _.filter(scenes, (scene) => {
                        if (_.intersection(scene.lights, group.lights).length === group.lights.length) {
                            return scene;
                        }
                    });
                }).catch((error) => {
                    this.logError("Error accessing Hue Bridge: ", JSON.stringify(error));
                });

            }

        }

        deferred.resolve();

        return deferred.promise;
    };

    /**
     *
     */
    RoomScenes.prototype.stop = function () {

    };

    /**
     *
     */
    RoomScenes.prototype.getState = function () {
        this.logInfo('>> getState: ' + JSON.stringify(this.state));
        return this.state;
    };

    /**
     *
     */
    RoomScenes.prototype.setState = function (state){
        this.state = state;
        this.publishStateChange();
    };


    /**
     *
     */
    RoomScenes.prototype.on = function (params) {

        let sceneId = params.sceneId;

        this.logInfo('>> on: ' + sceneId);

        if (this.isSimulated()) {
            this.publishStateChange();
        } else {
            if (sceneId) {
                //TODO: is it required to deactivate an acticated scene before activiting a new scene?
                this.device.hueApi.activateScene(sceneId).then((result) => {
                    this.state.activatedScene = sceneId;
                    this.publishStateChange();
                });
            }
        }
    };

    /**
     *
     */
    RoomScenes.prototype.off = function () {

        if (this.isSimulated()) {
            this.publishStateChange();
        } else {
            if (this.configuration.room) {
                this.device.hueApi.setGroupLightState(this.configuration.room, hue.lightState.create().off()).then((result) => {
                    this.publishStateChange();
                });
            }
        }
    };

    /**
     *
     */
    RoomScenes.prototype.toggle = function (state) {

        // TODO: do we need a toggle?

        this.state = state;

        this.logInfo('>> toggle: ' + this.state.active);

        if (this.state.active) {
            this.off();
        }
        else {
            this.on();
        }
    };
}