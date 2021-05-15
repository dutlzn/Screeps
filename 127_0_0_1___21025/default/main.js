var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepair = require('role.repair');
var roleWallRepairer = require('role.wallRepairer');
var creepFunction = require('creepFunction');
const { isFunction } = require('lodash');
require('prototype.spawn');
module.exports.loop = function() {

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

                if (creep.memory.role == 'wallRepairer') {
                    roleWallRepairer.run(creep);
                }
            }

            // 塔
            var towers = room.find(FIND_STRUCTURES, {
                filter: (s) => s.structureType == STRUCTURE_TOWER
            });

            for (let index in towers) {
                let tower = towers[index];
                // var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                //     filter: (structure) => structure.hits < 0.1 * structure.hitsMax
                // });
                // if (closestDamagedStructure) {
                //     tower.repair(closestDamagedStructure);
                // }

                var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                if (closestHostile) {
                    tower.attack(closestHostile);
                }
            }



            var minHarvesters = 6;
            var minUpgraders = 1;
            var minBuilders = 1;
            var minRepairers = 1;
            var minWallRepairers = 1;

            var numHarvesters = _.sum(Game.creeps, (c) => c.memory.role == 'harvester');
            var numUpgraders = _.sum(Game.creeps, (c) => c.memory.role == 'upgrader');
            var numBuilders = _.sum(Game.creeps, (c) => c.memory.role == 'builder');
            var numRepairers = _.sum(Game.creeps, (c) => c.memory.role == 'repairer');
            var numWallRepairers = _.sum(Game.creeps, (c) => c.memory.role == 'wallRepairer');


            // console.log(numHarvesters + " " + numBuilders + " " + numUpgraders + " " + numRepairers);


            var energy = room.energyAvailable;

            var spawn = Game.spawns['Spawn1'];

            if (numHarvesters < minHarvesters) {
                // Game.spawns['Spawn1'].spawnCreep([WORK, WORK, CARRY, MOVE], 'Harvester' + Game.time, { memory: { role: 'harvester', working: false } });
                spawn.createCustomCreep(energy, 'harvester');
            }
            if (numHarvesters >= minHarvesters && numUpgraders < minUpgraders) {
                // Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE, MOVE], 'Upgrader' + Game.time, { memory: { role: 'upgrader', working: false } });
                spawn.createCustomCreep(energy, 'upgrader');
            }

            // console.log(sites.length);
            if (numHarvesters >= minHarvesters && numBuilders < minBuilders && sites.length > 0) {
                // Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, WORK, MOVE], 'Builder' + Game.time, { memory: { role: 'builder', working: false } });
                spawn.createCustomCreep(energy, 'builder');
            }

            // console.log(sites.length);
            if (numHarvesters >= minHarvesters && numRepairers < minRepairers) {
                // Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, WORK, MOVE], 'Repairer' + Game.time, { memory: { role: 'repairer', working: false } });
                spawn.createCustomCreep(energy, 'repairer');
            }

            if (numHarvesters >= minHarvesters && numWallRepairers < minWallRepairers) {
                // Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, WORK, MOVE], 'Repairer' + Game.time, { memory: { role: 'repairer', working: false } });
                spawn.createCustomCreep(energy, 'wallRepairer');
            }


            // 显示创建creep的过程
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