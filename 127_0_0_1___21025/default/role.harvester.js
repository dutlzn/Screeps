var roleUpgrader = require('role.upgrader');
module.exports = {
    run: function(creep) {
        if(creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.working = false;
            // creep.say('⚡ 采集');
        }

        if (!creep.memory.working &&  creep.store.getFreeCapacity() == 0 ) {
            creep.memory.working = true;
            // creep.say('🏤 存储')
        }


        if(creep.memory.working == true) {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION || 
                        structure.structureType == STRUCTURE_SPAWN || 
                        structure.structureType == STRUCTURE_TOWER) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });

            if(targets.length > 0){
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    // creep.say('🏤 存储')
                    creep.moveTo(targets[0]);
                }
            } else {
                roleUpgrader.run(creep);
                // creep.suicide();
            }
        } else {
            var sources = creep.room.find(FIND_SOURCES);
            // console.log();
            let index = Math.floor(Math.random() * sources.length);
            if(creep.harvest(sources[index]) == ERR_NOT_IN_RANGE) {
                // creep.say('⚡ 采集');
                creep.moveTo(sources[index]);
            }
        }
    }
}