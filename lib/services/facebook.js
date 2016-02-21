"use strict";

var FB = require('fb');

module.exports = {
    config: function(appID, appSecret) {
        FB.options({
            appId: appID,
            appSecret: appSecret,
            version: 'v2.5'
        });
    },
    connect: function(state, callback) {
        generateAccessToken(state['fbsr_' + FB.options('appId')], function(res) {
            if(res && !res.error) {
                FB.setAccessToken(res.access_token);
                callback(true);
            } else {
                callback(false);
            }
        });
    },
    getProfile: function(callback) {
        FB.api('me', {fields:'age_range,first_name,last_name,gender,middle_name,verified'}, function (res) {
            if(!res || res.error) {
                console.log(!res ? 'error occurred' : res.error);
                return;
            }
            callback({
                type: 'facebook',
                data: res
            });
        });
    }
};

function generateAccessToken(signedRequestValue, callback) {
    var signedRequest  = FB.parseSignedRequest(signedRequestValue);
    if(signedRequest) {
        FB.api('oauth/access_token', {
            client_id: FB.options('appId'),
            client_secret: FB.options('appSecret'),
            redirect_uri: '',
            code: signedRequest.code
        }, function (res) {
            if(!res || res.error) {
                console.log(!res ? 'error occurred' : res.error);            
            }
            callback(res);
        });
    } else {
        callback();
    }
}
