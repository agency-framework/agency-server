"use strict";

exports.register = function (server, options, next) {
    server.route({
        method: 'GET',
        path: '/debug',
        config: {
            auth: {
                mode: 'optional'
//                strategy: 'facebook',
//                mode: 'try'
            },
            handler: function (request, reply) {                
                reply();
            }
        }
    });
    next();
};

exports.register.attributes = {
    name: 'debug',
    version: '1.0.0'
};
