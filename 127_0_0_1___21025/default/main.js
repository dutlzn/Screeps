var roleHarvester = require('role.harvester');
var roleBuilder = require('role.builder');
var roleUpgrader = require('role.upgrader');
var clear = require('clear');
var create = require('create');

module.exports.loop = function () {
    // 清空内存
    clear.run();
    // 创建creep
    create.run();
    create.show();


    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.memory.role == '采集') {
            roleHarvester.run(creep);
        }

        if (creep.memory.role == '建造') {
            // roleBuilder.run(creep);
        }

        if (creep.memory.role == '升级') {
            roleUpgrader.run(creep);
        }
    }
}