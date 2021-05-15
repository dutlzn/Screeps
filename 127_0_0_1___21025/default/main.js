var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepair = require('role.repair');
module.exports.loop = function () {

    for (let name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }

    for (let name in Game.rooms) {
        // console.log(Game.rooms[name]);
        let room = Game.rooms[name];
        var sites = room.find(FIND_CONSTRUCTION_SITES);
        if (room && room.controller && room.controller.my) {
            for (let name in Game.creeps) {
                var creep = Game.creeps[name];
                if (creep.memory.role == 'harvester') {
                    roleHarvester.run(creep);
                }

                if (creep.memory.role == 'upgrader') {
                    roleUpgrader.run(creep);
                }

                if (creep.memory.role == 'builder') {
                    roleBuilder.run(creep);
                }

                if (creep.memory.role == 'repairer') {
                    roleRepair.run(creep);
                }
            }

            var minHarvesters = 15;
            var minUpgraders = 1;
            var minBuilders = 1;
            var minRepairers = 8;
            var numHarvesters = _.sum(Game.creeps, (c) => c.memory.role == 'harvester');
            var numUpgraders = _.sum(Game.creeps, (c) => c.memory.role == 'upgrader');
            var numBuilders = _.sum(Game.creeps, (c) => c.memory.role == 'builder');
            var numRepairers = _.sum(Game.creeps, (c) => c.memory.role == 'repairer');




            if (numHarvesters < minHarvesters) {
                Game.spawns['Spawn1'].spawnCreep([WORK, WORK, CARRY, MOVE], 'Harvester' + Game.time, { memory: { role: 'harvester', working: false } });
            }
            if (numHarvesters >= minHarvesters && numUpgraders < minUpgraders) {
                Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE, MOVE], 'Upgrader' + Game.time, { memory: { role: 'upgrader', working: false } });
            }

            // console.log(sites.length);
            if (numHarvesters >= minHarvesters && numBuilders < minBuilders && sites.length > 0) {
                Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, WORK, MOVE], 'Builder' + Game.time, { memory: { role: 'builder', working: false } });
            }

            // console.log(sites.length);
            if (numHarvesters >= minHarvesters && numRepairers < minRepairers) {
                Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, WORK, MOVE], 'Repairer' + Game.time, { memory: { role: 'repairer', working: false } });
            }

            var spawn = Game.spawns['Spawn1'];
            if (spawn.spawning) {
                var spawningCreep = Game.creeps[spawn.spawning.name];
                spawn.room.visual.text(
                    '🛠️' + spawningCreep.name,
                    spawn.pos.x + 3,
                    spawn.pos.y,
                );
            }
        }
    }


}