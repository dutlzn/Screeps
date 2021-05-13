/**
 * 清除内存
 */
var clear = {
    run: function() {
        for(var name in Memory.creeps) {
            if(!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log('清除内存:' + name);
            }
        }
    }
}

module.exports = clear;