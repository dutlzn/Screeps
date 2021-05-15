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
    run: function(room) {
        var harvesters_num = 4;
        var upgrader_num = 4;
        var builder_num = 4;

        // 每个房间一个内存
        let harvesterTarget = _.get(room.memory, ['census', 'harvester'], harvesters_num);
        // console.log(harvesterTarget);
        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        if (harvesters.length < harvesterTarget) {
            var name = 'Harvester' + Game.time;
            Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], name, {memory: {role: 'harvester'}});
        }

        let buildTarget = _.get(room.memory, ['census', 'harvester'], builder_num);
        var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
        var sites = room.find(FIND_CONSTRUCTION_SITES);
        // 有建筑才去造
        if (sites.length >0 && builders.length < buildTarget && harvesters.length >= harvesterTarget ) {
            var name = 'Builder' + Game.time;
            Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], name, {memory: {role: 'builder'}});
        }

        let upgraderTarget = _.get(room.memory, ['census', 'upgrader'], upgrader_num);
        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        if (upgraders.length < upgraderTarget && harvesters.length >= harvesterTarget) {
            var name = 'Upgrader' + Game.time;
            Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], name, {memory: {role: 'upgrader'}});
        }
    }
}

module.exports = createCreep;