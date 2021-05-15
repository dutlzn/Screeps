StructureSpawn.prototype.createCustomCreep = function(energe, roleName) {
    var numberOfParts = Math.floor(energe / 200);
    // console.log(numberOfParts);
    var body = [];
    for (let i = 0; i < numberOfParts; ++i) {
        body.push(WORK);
    }

    for (let i = 0; i < numberOfParts; ++i) {
        body.push(CARRY);
    }
    for (let i = 0; i < numberOfParts; ++i) {
        body.push(MOVE);
    }
    // console.log(body);
    return this.spawnCreep(body, roleName + Game.time, { memory: { role: roleName, working: false } });

}