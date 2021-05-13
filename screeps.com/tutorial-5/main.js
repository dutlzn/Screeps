var creat = require('create');
var clear = require('clear');
var roleHarvester = require('role.harvester');
var roleBuilder = require('role.builder');
var roleUpgrader = require('role.upgrader');

module.exports.loop = function () {
    // 清空内存
    clear.run();
    // 创建creep
    creat.run();
    creat.show();
    // 根据不同的角色去做事
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == '采集') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == '建造') {
            // roleBuilder.run();
        }
        if(creep.memory.role == '升级') {
            roleUpgrader.run(creep);          
        }
    }
} 