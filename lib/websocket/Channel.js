"use strict";

var map = require('lodash/map');
var reject = require('lodash/reject');
var socketioJwt = require('socketio-jwt');
var UnauthorizedError = require('socketio-jwt/lib/UnauthorizedError');

function Channel(io, name, secret, limitedUsers, messageTypes) {
    this.name = name;
    this.secret = secret || null;
    this.limitedUsers = limitedUsers || null;
    this.msgTypes = messageTypes;

    io.setupNamespace(name, onSetup.bind(this));
}

Channel.prototype.onCreate = function() {

};

Channel.prototype.onClientConnect = function() {

};

Channel.prototype.addEventRouter = function(eventRouter) {
    this.nsp.use(eventRouter(this.msgTypes));
};

Channel.prototype.broadcast = function(eventName, msg) {
    this.nsp.emit(eventName, msg);
};

Channel.prototype.getUsers = function(id) {
    return reject(map(this.nsp.sockets, 'decoded_token'), function(client) { return client.id === id;});
};

function onSetup(nsp) {
    this.nsp = nsp;
    setupSecurity(nsp, this.secret, this.limitedUsers);
    this.onCreate(nsp);
    nsp.on('connect', onConnect.bind(this));
}

function onConnect(socket) {
    socket.decoded_token.id = socket.id;
    this.onClientConnect(socket);
}

function setupSecurity(nsp, secret, limitedUsers) {
    nsp.retirement = Math.max(nsp.retirement, 30 * 1000);
    if(limitedUsers) {
        addLimitedUsersAuthorization(nsp, secret, limitedUsers);
    } else {
        addUnlimitedUsersAuthorization(nsp, secret);
    }
}

function addLimitedUsersAuthorization(nsp, secret, limitedUsers) {
    nsp.use(socketioJwt.authorize({
        secret: secret,
        handshake: true,
        success: function(data, accept){
            if (data.request) {
                if(nsp.sockets.length > limitedUsers - 1) {
                    accept(new UnauthorizedError('user limit reached', {
                        message: 'BOOM'
                    }), data, accept);
                } else {
                    accept();
                }
            } else {
                accept(null, true);
            }
        }
    }));
}

function addUnlimitedUsersAuthorization(nsp, secret) {
    nsp.use(socketioJwt.authorize({
        secret: secret,
        handshake: true
    }));
}

module.exports = Channel;
