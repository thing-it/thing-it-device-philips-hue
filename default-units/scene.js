module.exports = {
    metadata: {
        plugin: "scene",
        label: "Scene",
        role: "actor",
        family: "scene",
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
            label: "Selected Scene",
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
            label: "Scene Active",
            id: "sceneActive",
            type: {
                id: "boolean"
            }
        }],
        configuration: [{
            label: "Scene Name",
            id: "sceneName",
            type: {
                id: "string"
            },
        }, {
            label: "Room Name",
            id: "roomName",
            type:{
                id: "string"
            }
        }]
    },
    create: function () {
        return new Scene();
    }
};

var q = require('q');
var hue = require('node-hue-api');
var _ = require('lodash')

function Scene(){
    /**
     *
     */
    Scene.prototype.start = function(){
        var deferred = q.defer();

        if (!this.isSimulated()){

            this.state.rooms = [];
            this.newScenes = [];

            this.state = {
                rooms: [],
                scenes: []
            };

            this.device.hueApi.groups().then((groups) => {

                groups.forEach((room) => {
                    this.state.rooms.push(room);
                });

            }).catch((error) => {
                this.logError("Error accessing Hue Bridge: ", JSON.stringify(error));
            });


            this.device.hueApi.scenes().then((scenes) => {
                scenes.forEach((scene) => {
                    this.newScenes.push({sceneName: scene.name, sceneId: scene.id, lights: scene.lights});
                });
            }).catch((error) => {
                this.logError("Error accessing Hue Bridge: ", JSON.stringify(error));
            });


            // for(var n in this.state.rooms) {
            //     if (this.state.selectedRoom === this.state.rooms[n].roomId)
            //         for (var x in newScenes) {
            //             if (this.state.rooms[n].Lights === newScenes[x].Lights) {
            //                 this.state.scenes.push({sceneName: newScenes[x].sceneName, sceneId: newScenes[x].sceneId});
            //             }
            //         }
            // }

            //this.state.sceneActive = false;

        }

        deferred.resolve();

        return deferred.promise;
    };

    /**
     *
     */
    Scene.prototype.stop = function () {

    };

    /**
     *
     */
    Scene.prototype.getState = function () {
        return this.state;
    };

    /**
     *
     */
    Scene.prototype.setState = function (state){
        let group = _.find(this.state.rooms, (group) => {
            if (group && group.id === this.state.selectedRoom) {
                return group;
            }
        });
        this.state.scenes = _.filter(this.newScenes, (scene) => {
            console.log(_.intersection(scene.lights, group.lights));
            if (_.intersection(scene.lights, group.lights).length === group.lights.length) {
                return scene;
            }
        });
    };


    /**
     *
     */
    Scene.prototype.on = function () {
        this.state.sceneActive = true;
        if (this.isSimulated()) {
            //this.publishStateChange();
        } else {
            this.device.hueApi.activateScene(this.state.selectedScene).then(function(result){
                this.logDebug("Scene Active: ", result);
            }.bind(this)).done();
        }
    };

    /**
     *
     */
    Scene.prototype.off = function () {
        this.state.sceneActive = false;

        if (this.isSimulated()) {
        } else {
            this.device.hueApi.setGroupLightState(this.state.selectedRoom, hue.lightState.create().off()).then(function (result) {
                this.logDebug("Scene Not Active: ",result);
                this.publishStateChange();
                }.bind(this)).done();
        }
        //this.publishStateChange();
    };

    /**
     *
     */
    Scene.prototype.toggle = function () {
        if (this.state.sceneActive) {
            this.off();
        }
        else {
            this.on();
        }
    };
}