"use strict";

//var redis = require('socket.io-redis');
var Channel = require('./Channel');
var message = require('./Message').getInstance();
var omit = require('lodash/object/omit');

function Socket(io, secret) {
    this.io = io;
    this.secret = secret;
    this.msgTypes = {SEND: 0, SENDTO: 1, SENDTOALL: 2, SENDTOSERVER: 3};

//    this.io.adapter(redis('pub-redis-13274.us-east-1-2.3.ec2.garantiadata.com:13274'));

    var channel = this.createChannel('/');
    channel.onClientConnect = function(client) {
        client.emit('config.custom', message.update('server', null, {
            client: omit(client.decoded_token, ['profile']),
            msgTypes: this.msgTypes
        }));
    };

    console.log('Websocket is running with initial channel', channel.name);
}

Socket.prototype.createChannel = function(name, limitedUsers) {
    return new Channel(this.io, name, this.secret, limitedUsers, this.msgTypes);
};

module.exports = Socket;
