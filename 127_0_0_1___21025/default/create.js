/**
 * 创建creeps
 */

var createCreep = {
    /**
     * 显示
     */
    show: function() {
        var spawn = Game.spawns['Spawn1'];
        if(spawn.spawning) {
            var spawningCreep = Game.creeps[spawn.spawning.name];
            spawn.room.visual.text(
                 '🛠️' + spawningCreep.name,
                 spawn.pos.x + 3,
                 spawn.pos.y,
            );
        }
    },
    /**
     * 创建
     */
    run: function() {
        var harvesters_num = 2;
        var upgrader_num = 2;
        var builder_num = 1;

        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == '采集');
        if (harvesters.length < harvesters_num) {
            var name = '采集者' + Game.time;
            Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], name, {memory: {role: '采集'}});
        }

        var builders = _.filter(Game.creeps, (creep) => creep.memory.role == '建造');
        if (builders.length < builder_num && harvesters.length >= harvesters_num) {
            var name = '建造者' + Game.time;
            Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], name, {memory: {role: '建造'}});
        }
        
        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == '升级');
        if (upgraders.length < upgrader_num && harvesters.length >= harvesters_num) {
            var name = '升级者' + Game.time;
            Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], name, {memory: {role: '升级'}});
        }
    }
}

module.exports = createCreep;