'use strict';

var googl = require('goo.gl');
googl.setKey('AIzaSyBvRBxSjMjZyExzrUd66nhogBuqvqTyTMQ');

module.exports = {
    shortenUrl: function(url, callback) {
        googl.shorten(url)
            .then(function (shortUrl) {
                callback(shortUrl);
            })
            .catch(function (err) {
                callback('url invalid', err);
            });
    },
    qrCode: function(url) {
        return 'http://chart.googleapis.com/chart?cht=qr&chs=500x500&choe=UTF-8&chld=H&chl=' + url;
    }
};
