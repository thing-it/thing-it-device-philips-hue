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
            label: "Rooms",
            id: "rooms",
            type: {
                id: "any"
            }
        }, {
            label: "Selected RoomScenes",
            id: "selectedScene",
            type: {
                id: "any"
            }
        }, {
            label: "Selected Room",
            id: "selectedRoom",
            type: {
                id: "any"
            }
        }, {
            label: "Active",
            id: "active",
            type: {
                id: "boolean"
            }
        }],
        configuration: [{
            label: "RoomScenes",
            id: "scene",
            type: {
                id: "string"
            },
        }, {
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
                rooms: [],
                scenes: []
            };

            if (this.configuration.room) {
                this.state.selectedRoom = this.configuration.room;
            }

            if (this.configuration.scene) {
                this.state.selectedScene = this.configuration.scene;
            }

            this.device.hueApi.groups().then((groups) => {
                groups.forEach((room) => {
                    if (room.type === 'Room') {
                        this.state.rooms.push(room);
                    }
                });
            }).catch((error) => {
                this.logError("Error accessing Hue Bridge: ", JSON.stringify(error));
            });

            this.device.hueApi.scenes().then((scenes) => {
                scenes.forEach((scene) => {
                    this.newScenes.push(scene);
                });
            }).catch((error) => {
                this.logError("Error accessing Hue Bridge: ", JSON.stringify(error));
            });

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
        this.logInfo('>> setState: ' + JSON.stringify(this.state));
        this.state = state;

        if (this.state.selectedRoom) {

            this.configuration.room = this.state.selectedRoom;

            let group = _.find(this.state.rooms, (group) => {
                if (group && group.id === this.state.selectedRoom) {
                    return group;
                }
            });

            this.state.scenes = _.filter(this.newScenes, (scene) => {
                if (_.intersection(scene.lights, group.lights).length === group.lights.length) {
                    return scene;
                }
            });

        }

        if (this.state.selectedScene) {
            this.configuration.scene = this.state.selectedScene;
        }

        this.publishStateChange();
    };


    /**
     *
     */
    RoomScenes.prototype.on = function () {

        this.logInfo('>> on: ' + this.state.active);

        this.state.active = true;

        if (this.isSimulated()) {
            this.publishStateChange();
        } else {
            if (this.configuration.scene) {
                this.device.hueApi.activateScene(this.configuration.scene).then((result) => {
                    this.publishStateChange();
                });
            }
        }
    };

    /**
     *
     */
    RoomScenes.prototype.off = function () {

        this.logInfo('>> off: ' + this.state.active);

        this.state.active = false;

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