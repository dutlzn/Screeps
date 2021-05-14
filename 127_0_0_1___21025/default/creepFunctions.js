Creep.prototype.findEnergySource = function() {
    let sources = this.room.find(FIND_SOURCES);
    if(sources.length) {
        this.memory.source = sources[0].id;
        return sources[0];
    }
}