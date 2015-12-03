"use strict";

function Message() {
    this.from = null;
    this.objectType = null;
    this.data = null;
}

Message.prototype.update = function(from, objectType, data) {
    this.from = from || null;
    this.objectType = objectType || null;
    this.data = data || null;
    return this;
};

module.exports = {
    getInstance: function() {
        return new Message();
    }
};
