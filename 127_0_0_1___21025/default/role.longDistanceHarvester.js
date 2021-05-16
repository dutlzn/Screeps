var roleUpgrader = require('role.upgrader');
module.exports = {
    run: function(creep) {
        if (creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.working = false;
            // creep.say('⚡ 采集');
        }

        if (!creep.memory.working && creep.store.getFreeCapacity() == 0) {
            creep.memory.working = true;
            // creep.say('🏤 存储')
        }


        if (creep.memory.working == true) {

            if (creep.room.name == creep.memory.home) {
                var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_SPAWN ||
                                structure.structureType == STRUCTURE_TOWER) &&
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
                });

                if (targets.length > 0) {
                    if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.say('存储')
                        creep.moveTo(targets[0]);
                    }
                } else {
                    roleUpgrader.run(creep);
                    // creep.suicide();
                }
            } else {
                const exitDir = creep.room.findExitTo(creep.memory.home);
                const exit = creep.pos.findClosestByRange(exitDir);
                creep.say('回家');
                creep.moveTo(exit);
            }

        } else {
            if (creep.room.name == creep.memory.target) {
                // let source = Game.getObjectById(creep.memory.source) || creep.findEnergySource();
                var source = creep.room.find(FIND_SOURCES)[creep.memory.sourceId];
                if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.say('采集');
                    creep.moveTo(source);
                }
            } else {
                const exitDir = creep.room.findExitTo(creep.memory.target);
                const exit = creep.pos.findClosestByRange(exitDir);
                creep.say('去指定房间');
                creep.moveTo(exit);
            }
        }
    }
}