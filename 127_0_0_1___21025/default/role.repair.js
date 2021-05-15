var roleUpgrader = require('role.upgrader');
module.exports = {
    run: function(creep) {
        if (creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.working = false;
            // creep.say('⚡ 采集');
        }

        if (!creep.memory.working && creep.store.getFreeCapacity() == 0) {
            creep.memory.working = true;
            // creep.say('🚧 建造');
        }


        if (creep.memory.working == true) {
            // repaire something 
            var structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                // 城墙
                filter: (s) => s.hits < 0.1 * s.hitsMax && s.structureType != STRUCTURE_WALL
            });
            // console.log(structure);
            if (structure != undefined) {
                if (creep.repair(structure) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(structure);
                }
            } else {
                roleUpgrader.run(creep);
            }

        } else {
            let source = Game.getObjectById(creep.memory.source) || creep.findEnergySource();
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
                // creep.say('⚡ 采集');
            }
        }
    }
}