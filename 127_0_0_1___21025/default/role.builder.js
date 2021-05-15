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
            // 如果没有建筑了 就自杀
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if (targets.length > 0) {
                if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                    // creep.say('🚧 建造');
                }
            } else {
                roleUpgrader.run(creep);
                // creep.suicide();
                // console.log("没有建筑，自杀");
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