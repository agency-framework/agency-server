"use strict";

//var redis = require('socket.io-redis');
var Channel = require('./Channel');
var message = require('./Message').getInstance();
var google = require('../services/google');
var parse = require('url-parse');
var omit = require('lodash/omit');
var os = require('os');
var hostname = os.hostname();
console.log(hostname);

function Socket(io, secret) {
    this.io = io;
    this.secret = secret;
    this.msgTypes = {SEND: 0, SENDTO: 1, SENDTOALL: 2, SENDTOSERVER: 3};

//    this.io.adapter(redis('pub-redis-13274.us-east-1-2.3.ec2.garantiadata.com:13274'));

    var channel = this.createChannel('/');
    channel.onClientConnect = function(client) {
        if(!client.decoded_token.profile) {
            var url = 'http://' + client.decoded_token.host;
            if(!/(herokuapp\.com)/.test(client.decoded_token.host)) {
                url += '/dev';
            }
            url += '/index.html?session=' + getSessionId(client);
            google.shortenUrl(url, function(shortUrl) {
                client.emit('config.custom', message.update('server', null, {
                    client: omit(client.decoded_token, ['profile']),
                    types: this.msgTypes,
                    accessUrl: shortUrl
                }));
            }.bind(this));
        } else {
            client.emit('config.custom', message.update('server', null, {
                client: omit(client.decoded_token, ['profile']),
                types: this.msgTypes
            }));
        }
    };

    console.log('Websocket is running with initial channel', channel.name);
}

Socket.prototype.createChannel = function(name, limitedUsers) {
    return new Channel(this.io, name, this.secret, limitedUsers, this.msgTypes);
};

function getSessionId(client) {
    return (parse(client.handshake.headers.referer, true).query.session || client.decoded_token.id);
}

module.exports = Socket;
