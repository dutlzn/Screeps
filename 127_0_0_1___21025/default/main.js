var roleHarvester = require('role.harvester');
var roleBuilder = require('role.builder');
var roleUpgrader = require('role.upgrader');
var clear = require('clear');
var create = require('create');
var creepFunction = require('creepFunctions');

module.exports.loop = function () {
    // 清空内存
    clear.run();
    // create.run();
    // create.show();

    // for(var name in Game.rooms) {
    //     console.log('Room "'+name+'" has '+Game.rooms[name].energyAvailable+' energy');
    // }

    _.forEach(Game.rooms, function(roomName) {

        let room = Game.rooms[roomName.name];;
        if(room && room.controller && room.controller.my) {
            create.run(room);
            create.show();
        }
    })

    
    


    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }

        if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }

        if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
    }
}