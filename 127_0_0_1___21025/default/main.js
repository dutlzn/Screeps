var roleHarvester = require('role.harvester');
var roleBuilder = require('role.builder');
var roleUpgrader = require('role.upgrader');
var clear = require('clear');
var create = require('create');
var creepFunction = require('creepFunctions');

module.exports.loop = function () {
    // 清空内存
    clear.run();


    _.forEach(Game.rooms, function(roomName) {

        let room = Game.rooms[roomName.name];;
        if(room && room.controller && room.controller.my) {
            // console.log('房间:' + roomName.name +"有" + room.energyAvailable + "能量");
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