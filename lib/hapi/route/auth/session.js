"use strict";

var aguid = require('aguid');
var jwt = require('jsonwebtoken');
var _ = require('lodash');
var facebook = require('../../../services/facebook');

exports.register = function (server, options, next) {
    facebook.config(options.appId, options.appSecret);

    server.route({
        method: ['GET','POST'],
        path: "/auth/session",
        config: {
            auth: false,
            cors: {
                credentials: true,
                exposedHeaders: ['Authorization']
            }
        },
        handler: function(request, reply) {            
            var response = reply().hold();
            var session = _.extend(JSON.parse(request.payload.data || '{}'), {
                host: request.info.host,
                valid: true, // this will be set to false when the person logs out
                auth_id: aguid(), // a random session id
                exp: new Date().getTime() + 30 * 60 * 1000 // expires in 30 minutes time
            });
            facebook.connect(request.state, function(isConnected) {
                if(isConnected) {
                    facebook.getProfile(function(profile) {
                        session.profile = profile;
                        sendReply(response, session, options.secret);
                    });
                } else {
                    // TODO: Must send an error because no valid access token received
                    sendReply(response, session, options.secret);
                }
            });
        }
    });

    next();
};

function sendReply(reply, session, secret) {
    if(session) {
        reply.header("Authorization", jwt.sign(session, secret));
    } else {
        reply.code(403);
    }
    reply.send();
}

exports.register.attributes = {
    name: 'auth/session',
    version: '1.0.0'
};
