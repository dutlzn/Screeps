var roleBuilder = {
    run: function(creep) {
        var sources = creep.room.find(FIND_SOURCES);
        var source = sources[0];

        if(creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
            creep.say('⚡ 采集');
        }

        if(!creep.memory.building && creep.store.getFreeCapacity() > 0) {
            creep.memory.building = true;
            creep.say('🚧 建造');
        }

        if(creep.memory.building) {
            // 建造
        } else {
            // 采集
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, { visualizePathStyle: { stroke: 'yellow' } });
            }
        }
    }
}

module.exports = roleBuilder;