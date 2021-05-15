var roleUpgrader = require('role.upgrader');
module.exports = {
    run: function(creep) {
        if(creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.working = false;
            // creep.say('⚡ 采集');
        }

        if (!creep.memory.working &&  creep.store.getFreeCapacity() == 0 ) {
            creep.memory.working = true;
	        // creep.say('🚧 建造');
        }


        if(creep.memory.working == true) {
            // repaire something 
            var structure = creep.pos.findClosestByPath(FIND_STRUCTURES,{
                filter: (s) => s.hits < s.hitsMax && s.structureType != STRUCTURE_WALL && s.structureType != STRUCTURE_ROAD
            });
            // console.log(structure);
            if(structure != undefined) {
                if(creep.repair(structure) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(structure);
                }
            } else {
                roleUpgrader.run(creep);
            }

        } else {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
                // creep.say('⚡ 采集');
            }
        }
    }
}