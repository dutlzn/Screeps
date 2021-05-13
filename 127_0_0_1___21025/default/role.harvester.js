/**
 * 采集
 */
var roleHarvesters = {
    run: function(creep) {
        // 查询所有资源
        // console.log(sources);
        // 还有空余就去采集
        if(creep.store.getFreeCapacity() > 0) {
            var sources = creep.room.find(FIND_SOURCES);
            var source = sources[0];
            // console.log(source);
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source,  {visualizePathStyle: {stroke: 'blue'}})
                creep.say('⚡ 采集');
            }
        } else {
            // 全部都存储
            if(creep.transfer(Game.spawns['Spawn1'], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.spawns['Spawn1'], {visualizePathStyle: {stroke: 'red'}});
                creep.say('🏤 存储')
            }
        }
    }
}

module.exports = roleHarvesters;