var roleUpgrader = {
    run: function (creep) {
        if (creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
            // 正在升级，并且用光了energy
            creep.memory.upgrading = false;
            creep.say('⚡ 采集');
        }
        if (!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
            // 正在采集，并且没有多余空间存储了
            creep.memory.upgrading = true;
            creep.say('🔼 升级');
        }

        if (creep.memory.upgrading) {
            // 升级
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: 'blue' } });
                creep.say('🔼 升级');
            }
        } else {
            // 采集
            var sources = creep.room.find(FIND_SOURCES);
            var source = sources[0];;
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, { visualizePathStyle: { stroke: 'red' } });
                creep.say('⚡ 采集');
            }
        }
    }
}

module.exports = roleUpgrader;