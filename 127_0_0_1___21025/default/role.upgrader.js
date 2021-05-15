module.exports = {
    run: function(creep) {
        if (creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.working = false;
            // creep.say('⚡ 采集');
        }

        if (!creep.memory.working && creep.store.getFreeCapacity() == 0) {
            creep.memory.working = true;
            // creep.say('🔼 升级');
        }


        if (creep.memory.working == true) {
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
                // creep.say('🔼 升级');
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