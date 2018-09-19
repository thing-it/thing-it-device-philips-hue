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

function Scene(){
    /**
     *
     */
    Scene.prototype.start = function(){
        this.state.sceneActive = false;
        this.device.hueApi.scenes()
            .then(function(result){
                for(var n in result){
                    this.state.scenes.push({sceneName: result[n].name, sceneId: result[n].id} );
                }
            }.bind(this)).done();

        this.device.hueApi.groups()
            .then(function(group){
                for(var n in group){
                    this.state.rooms.push({roomName: group[n].name, roomId: group[n].id});
                }
            }.bind(this)).done();

        this.publishStateChange();
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
        this.device.hueApi.scenes()
            .then(function(result){
                for(var n in result){
                    this.state.scenes.push({sceneName: result[n].name, sceneId: result[n].id} );
                }
            }.bind(this)).done();

        this.device.hueApi.groups()
            .then(function(result){
                for(var n in result){
                    this.state.rooms.push({roomName: result[n].name, roomId: result[n].id});
                }
            }.bind(this)).done();

        this.publishStateChange();
        return this.state;
    };

    /**
     *
     */
    Scene.prototype.setState = function (state){
    };


    /**
     *
     */
    Scene.prototype.on = function () {
        this.state.sceneActive = true;
        if (this.isSimulated()) {
            this.publishStateChange();
        } else {
            this.device.hueApi.activateScene(this.state.selectedScene).then(function(result){
                this.logDebug("Scene Active: ", result);
                this.publishStateChange();
            }.bind(this)).done();
        }
    };

    /**
     *
     */
    Scene.prototype.off = function () {
        this.state.sceneActive = false;

        if (this.isSimulated()) {
            this.publishStateChange();
        } else {
            this.device.hueApi.setGroupLightState(this.state.selectedRoom, hue.lightState.create().off()).then(function (result) {
                this.logDebug("Scene Not Active: ",result);
                this.publishStateChange();
                }.bind(this)).done();
        }
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