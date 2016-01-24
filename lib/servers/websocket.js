"use strict";

var Socket = require('../websocket/Socket');
var EventRouter = require('../websocket/EventRouter');
var message = require('../websocket/Message').getInstance();

module.exports = function(server, websocketConfig, secret) {
    var socket = new Socket(require('dynamic.io')({publicStatus: true}).listen(server.listener), secret);

    var wildcardChannel = socket.createChannel('*', websocketConfig.limitedUsers);
    wildcardChannel.onCreate = function() {
        this.addEventRouter(EventRouter.defaults);
    };
    wildcardChannel.onClientConnect = function(client) {
        console.log('connected to', client.nsp.fullname());
        client.emit('user:init.custom', message.update('server', null, this.getUsers(client.id)));
        client.broadcast.emit('user:add.custom', message.update('server', null, client.decoded_token));

        client.on('disconnect', function() {
            console.log('disconnected from', client.nsp.fullname(), client.decoded_token.id);
            client.broadcast.emit('user:remove.custom', message.update('server', null, {id: client.decoded_token.id}));
        });
    };
};
