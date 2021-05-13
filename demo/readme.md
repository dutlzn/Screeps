# Screeps教程

# 参考教程

[入门](https://www.jianshu.com/p/5431cb7f42d3)

[进阶](https://zhuanlan.zhihu.com/p/104412058)

[api文档](https://screeps-cn.github.io/api/)

### 建立creep

```
var spawn = Game.spawns['Spawn1'];
spawn.spawnCreep([WORK, CARRY, MOVE], 'Harvester1');
```
### 选择creep

```
Game.creeps[name]
```

### 查找所有资源

    var creep = Game.creeps['Harvester1'];
    var sources = creep.room.find(FIND_SOURCES);
### 采集资源



从 source 中采集能量或者从 mineral 或 deposit 中采集资源。需要 `WORK` 身体部件。如果 creep 有空余的 `CARRY` 身体，则会自动将采集到的资源转移进去；否则将会掉落在地上。目标必须与 creep 相邻

```js
creep.harvest(sources[0]));
```

### 移动



会有距离问题 ，要将creep移动过去

```
module.exports.loop = function () {
    var creep = Game.creeps['Harvester1'];
    var sources = creep.room.find(FIND_SOURCES);
    // console.log(sources[0]);
    // console.log(creep.harvest(sources[0]));
    if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE){
        // console.log('MOVE');
        creep.moveTo(sources[0]);
    }
}
```



### 查看creep剩余空间

```
    console.log(creep.store.getFreeCapacity());
```

```
creep.store[RESOURCE_ENERGY] == 0
```



### 传送



```
creep.transfer(Game.spawns['Spawn1'], RESOURCE_ENERGY)
```

返回距离太远 和采集资源同理



### 遍历creep

```
for(var obj in obj-iterator){
	console.log(obj);
}
```



### 引入外部模块

role.harvester

````
var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
	    if(creep.store.getFreeCapacity() > 0) {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
        }
        else {
            if(creep.transfer(Game.spawns['Spawn1'], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.spawns['Spawn1']);
            }
        }
	}
};

module.exports = roleHarvester;
````



main

```
var roleHarvester = require('role.harvester');

module.exports.loop = function () {

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        roleHarvester.run(creep);
    }
}
```



### memory

为此，我们需要利用每个 creep 都有的 `memory` 属性，该属性允许在 creep 的“内存”中写入自定义信息。这样，我们就可以给 creep 分配不同的角色。

您储存的所有内存信息可以通过全局对象 `内存` 访问。这两种方式您想用哪种都可以。

使用控制台将属性 `role='harvester'` 写入采集单位的内存，将 `role='upgrader'` 写入升级单位的内存。

````
Game.creeps['Harvester1'].memory.role = 'harvester';
Game.creeps['Upgrader1'].memory.role = 'upgrader';
````





### 升级控制器

```
var roleUpgrader = {
    run: function(creep) {
        if(creep.store.getFreeCapacity() > 0) {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE){
                creep.moveTo(sources[0]);
            }
        }
        else {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
    }
}

module.exports = roleUpgrader;
```



控制器升级解锁了新的建筑：wall、rampart 以及 extension

**Extension** 被用来孵化更大型的 creep。每种身体类型只有一个部件的 creep 工作并不高效。多为其添加几个 `WORK` 部件可以让它们成比例的提高效但是，这样的 creep 会更加的昂贵，并且单独一个 spawn 只能容纳最多 300 点能量。想要孵化成本超过 300 点能量的 creep，您需要 spawn 拓展（即 extension）。





### 指定role创建creep

```
Game.spawns['Spawn1'].spawnCreep( [WORK, CARRY, MOVE], 'Builder1',
    { memory: { role: 'builder' } } );
```





### 建造 extensions

建造是通过对建筑工地执行 `Creep.build` 方法进行的，而工地则可以通过 `Room.find(FIND_CONSTRUCTION_SITES)` 搜索得到。建造建筑需要能量，您的 creep 应该自己去采集它们。

为了避免由于身上资源耗尽而频繁的来回移动，让我们通过添加一个新的布尔变量 `creep.memory.building` 来增强一下代码，这个变量将会告诉 creep 应该何时切换任务。我们还调用了 `creep.say` 并且在 `moveTo` 方法中添加了 `visualizePathStyle` 选项来可视化 creep 的移动路径。

```
var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

	    if(creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
	    }
	    if(!creep.memory.building && creep.store.getFreeCapacity() == 0) {
	        creep.memory.building = true;
	        creep.say('🚧 build');
	    }

	    if(creep.memory.building) {
	        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
	    }
	    else {
	        var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
	    }
	}
};

module.exports = roleBuilder;
```





表情符号

https://home.unicode.org/emoji/emoji-frequency/





main

```
var roleHarvester = require('role.harvester');
var roleBuilder = require('role.builder');

module.exports.loop = function () {

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }
}
```





想要维护 extension，您需要教会您的采集单位把能量运输到 extension 而不仅仅是 spawn。为此，您需要使用 `Game.structures` 对象或者在对应的房间执行 `Room.find(FIND_STRUCTURES)` 方法进行搜索。无论使用哪种方式，您都需要用判断条件 `structure.structureType == STRUCTURE_EXTENSION`（或者 `structure instanceof StructureExtension`）对结果列表进行筛选，还有别忘了检查它们存有多少能量（就像之前检查 creep 一样）。



```js
var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
	    if(creep.store.getFreeCapacity() > 0) {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
            });
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
	}
};

module.exports = roleHarvester;
```



想要了解房间里总共有多少能量可以用于孵化，您可以使用 `Room.energyAvailable` 属性。让我们把这个属性输出到控制台中以便在 extension 填充期间对其进行追踪。



main

```
var roleHarvester = require('role.harvester');
var roleBuilder = require('role.builder');

module.exports.loop = function () {

    for(var name in Game.rooms) {
        console.log('Room "'+name+'" has '+Game.rooms[name].energyAvailable+' energy');
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }
}
```




现在我们的 spawn 和 extension 中总共有 550 点能量。这已经足够建造一个身体部件为 `[WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE]` 的 creep 了。这个 creep 的效率是普通工作单位的 4 倍。但是这也让它变得更重，所以我们给它添加了额外的 `MOVE` 部件。但是，两个 `MOVE` 也没办法让它跑得像小 creep 那样快，除非我们给他添加 4 个 `MOVE` 或者修一条路。

孵化一个身体部件为 `[WORK,WORK,WORK,CARRY,MOVE,MOVE]`，名称为 `HarvesterBig` 的 creep 并且设为 `harvester` 角色。



```
Game.spawns['Spawn1'].spawnCreep( [WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE],
    'HarvesterBig',
    { memory: { role: 'harvester' } } );
```





### 自动孵化creep（很难）

到目前为止，我们都是通过在控制台中输入命令来手动创建新的 creep。我们并不推荐经常这么做，因为 Screeps 的主旨就是让您的殖民地实现自我控制。更好的做法是教会您这个房间中的 spawn 自己生产 creep。

这是一个相当复杂的问题，许多玩家会花费几个月的时间来完善和增强他们的自动孵化代码。但是先让我们从简单开始，来了解一些相关的基本原则。

---



您需要在老的 creep 因为寿命或其他原因死掉时孵化新的 creep。由于游戏中没有事件机制来报告特定 creep 的死亡。所以最简单的方式就是通过统计每种 creep 的数量，一旦其数量低于给定值，就开始孵化。

有很多种方法可以统计指定类型的 creep 数量。其中一种就是通过 `_.filter` 方法以及 creep 内存中的 role 字段对 `Game.creeps` 进行筛选。让我们尝试一下，并把 creep 的数量显示在控制台中。

---

假设我们最少需要维持两个采集单位（harvester），最简单的办法就是：每当我们发现它们的数量小于这个值时，就执行 `StructureSpawn.spawnCreep` 方法。您可能还没想好它们应该叫什么（这一步我们会自动给它们起名字），但是不要忘了给他们设置需要的角色（role）。

我们还会添加一些新的 `RoomVisual` 来显示当前正在孵化的 creep。

main

```
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');

module.exports.loop = function () {

    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    console.log('Harvesters: ' + harvesters.length);

    if(harvesters.length < 2) {
        var newName = 'Harvester' + Game.time;
        console.log('Spawning new harvester: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], newName, 
            {memory: {role: 'harvester'}});        
    }
    
    if(Game.spawns['Spawn1'].spawning) { 
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1, 
            Game.spawns['Spawn1'].pos.y, 
            {align: 'left', opacity: 0.8});
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
    }
}
```



模拟死亡

```
Game.creeps['Harvester1'].suicide()
```

还有一件事，由于死亡 creep 的内存我们之后可能会用到，所以它们并不会被自动清除。如果您每次都用随机名称去孵化新 creep 的话，内存可能会因此溢出，所以您需要在每个 tick 开始的时候将它们清除掉（creep 创建代码之前）。

main

```
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');

module.exports.loop = function () {

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    console.log('Harvesters: ' + harvesters.length);

    if(harvesters.length < 2) {
        var newName = 'Harvester' + Game.time;
        console.log('Spawning new harvester: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], newName, 
            {memory: {role: 'harvester'}});
    }
    
    if(Game.spawns['Spawn1'].spawning) { 
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1, 
            Game.spawns['Spawn1'].pos.y, 
            {align: 'left', opacity: 0.8});
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
    }
}
```

