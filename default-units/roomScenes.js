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
        }],
        state: [{
            label: "Scenes",
            id: "scenes",
            type: {
                id: "any"
            }
        }, {
            label: "Active Scene",
            id: "activeScene",
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

            this.logInfo('>> start:room:' + this.configuration.room);

            if (this.configuration.room) {

                this.device.hueApi.groups().then((groups) => {

                    let group = _.find(groups, (room) => {
                        if (room.type === 'Room' && room.id === this.configuration.room) {
                            return room;
                        }
                    });

                    if (group) {

                        this.device.hueApi.scenes().then((scenes) => {

                            this.state.scenes = _.filter(scenes, (scene) => {
                                if (_.isEqual(scene.lights, group.lights)) {
                                    return scene;
                                }
                            });

                            deferred.resolve();

                        }).catch((error) => {
                            this.logError("Error accessing Hue Bridge: ", JSON.stringify(error));
                            deferred.reject(error);
                        });

                    } else {
                        deferred.resolve();
                    }


                }).catch((error) => {
                    this.logError("Error accessing Hue Bridge: ", JSON.stringify(error));
                    deferred.reject(error);
                });

            } else {
                deferred.resolve();
            }

        }

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

        const scene = params.scene;

        this.logInfo('>> on: ' + JSON.stringify(scene));

        if (this.isSimulated()) {
            this.publishStateChange();
        } else {
            if (scene) {
                this.device.hueApi.activateScene(scene.id).then((result) => {
                    this.logInfo('>> ' + JSON.stringify(result));
                    this.state.activeScene = scene.id;
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

}