/**
 * 采集
 */
var roleHarvesters = {
    run: function(creep) {
        // 查询所有资源
        // console.log(sources);
        // 还有空余就去采集
        if(creep.store.getFreeCapacity() > 0) {
            let source = Game.getObjectById(creep.memory.source) || creep.findEnergySource();
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source,  {visualizePathStyle: {stroke: 'blue'}})
                creep.say('⚡ 采集');
            }
        } else {
            // 全部都存储
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
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: 'red'}});
                    creep.say('🏤 存储')
                }
            } else {
                var closestDamagedStructure = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => (structure.structureType == STRUCTURE_WALL) && (structure.hits < structure.hitsMax)
                });
                if(closestDamagedStructure.length > 0) {
                    if(creep.repair(closestDamagedStructure[0]) == ERR_NOT_IN_RANGE) {
                        creep.say('🚧 修复');
                        creep.moveTo(closestDamagedStructure[0]);
                    }
                } else {
                    creep.suicide();
                }
            }
        }
    }
}

module.exports = roleHarvesters;