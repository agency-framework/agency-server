"use strict";

var ioEvents = require('socket.io-events');
var message = require('./Message').getInstance();

module.exports = {
    defaults: function(msgTypes) {
        var eventRouter = ioEvents();
        eventRouter.on('*', function (client, args) {
            var name = args.shift(), msg = args.shift();
            switch(msg.type) {
                // send to all except sender
                case msgTypes.SEND:                
                    client.sock.broadcast.emit(name, message.update(client.id, msg.moduleId, msg.data));
                    break;
                // send to explicit clients
                case msgTypes.SENDTO:
                    msg.to.forEach(function(id) {
                        var socket = client.sock.nsp.connected[id];
                        if(socket) {
                            socket.emit(name, message.update(client.id, msg.moduleId, msg.data));
                        }
                    });
                    break;
                // send to all
                case msgTypes.SENDTOALL:
                    client.sock.nsp.emit(name, message.update(client.id, msg.moduleId, msg.data));
                    break;
                // send back to sender
                default:
                    client.emit(name, message.update(client.id, msg.moduleId, msg.data));
                    break;
            }
//            next();
        });
        return eventRouter;
    }
};
