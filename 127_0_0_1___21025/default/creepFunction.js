Creep.prototype.findEnergySource = function() {
    let sources = this.room.find(FIND_SOURCES);
    let index = Math.floor(Math.random() * sources.length);
    if (sources.length) {
        this.memory.source = sources[index].id;
        return sources[index];
    }
}