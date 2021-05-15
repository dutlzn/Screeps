var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

	    if(creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
            creep.say('🔄 采集');
	    }
	    if(!creep.memory.building && creep.store.getFreeCapacity() == 0) {
	        creep.memory.building = true;
	        creep.say('🚧 建造');
	    }

	    if(creep.memory.building) {
            // 如果没有建筑了 就自杀
	        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: 'yellow'}});
                }
            } else {
                creep.suicide();
                // console.log("没有建筑，自杀");
            }
	    }
	    else {
            let source = Game.getObjectById(creep.memory.source) || creep.findEnergySource();
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: 'green'}});
            }
	    }
	}
};

module.exports = roleBuilder;