'use strict';

var googl = require('goo.gl');
googl.setKey('AIzaSyBvRBxSjMjZyExzrUd66nhogBuqvqTyTMQ');

module.exports = {
    shortenUrl: function(url, callback) {
        console.log('URL',url);
        googl.shorten(url)
            .then(function (shortUrl) {
                callback(shortUrl);
            })
            .catch(function (err) {            
                callback(url, err);
            });
    },
    qrCode: function(url) {
        return 'http://chart.googleapis.com/chart?cht=qr&chs=500x500&choe=UTF-8&chld=H&chl=' + url;
    }
};
