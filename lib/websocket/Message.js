"use strict";

function Message() {
    this.from = null;
    this.moduleId = null;
    this.data = null;
}

Message.prototype.update = function(from, moduleId, data) {
    this.from = from || null;
    this.moduleId = moduleId || null;
    this.data = data || null;
    return this;
};

module.exports = {
    getInstance: function() {
        return new Message();
    }
};
