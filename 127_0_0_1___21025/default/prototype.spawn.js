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

    },

    StructureSpawn.prototype.createLongDistanceHarvester = function(energe, numberOfWorkParts, home, target, sourceId) {
        var body = [];
        for (let i = 0; i < numberOfWorkParts; ++i) {
            body.push(WORK);
        }
        energe -= 150 * numberOfWorkParts;
        var numberOfParts = Math.floor(energe / 100);
        for (let i = 0; i < numberOfParts; ++i) {
            body.push(CARRY);
        }
        for (let i = 0; i < numberOfParts + numberOfWorkParts; ++i) {
            body.push(MOVE);
        }

        // console.log("energe:" + energe + " body:" + body);

        console.log(body);

        return this.spawnCreep(body, 'ldh' + Game.time, {
            memory: {
                role: 'longDistanceHarvester',
                home: home,
                target: target,
                sourceId: sourceId,
                working: false
            }
        })
    }