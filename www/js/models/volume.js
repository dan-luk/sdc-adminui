"use strict";

var $ = require('jquery');
var Model = require('./model');
var Job = require('./job');
var api = require('../request');

var Volume = Model.extend({
    urlRoot: '/api/volumes',

    idAttribute: 'uuid',

    del: function(attrs, cb) {
        api.del(this.url()).send(attrs).end(function (res) {
            if (res.ok) {
                var job = new Job({ uuid: res.body.job_uuid });
                cb(job);
            } else {
                cb(null, res.body);
            }
        });
    },

    createSnapshot: function(cb) {
        var req = $.post(this.url() + '?action=create_snapshot', {});
        req.done(function(data) {
            var job = new Job({
                uuid: data.job_uuid
            });
            cb(job);
        });
        req.error(function(res) {
            var error = {};
            try {
                error = JSON.parse(res.responseText);
            } catch (e) {
                error.message = 'Error creating snapshot: '+ res.statusText;
            }
            cb(null, error);
        });
    },

    rollbackSnapshot: function(snapshotName, cb) {
        $.post(this.url() + '?action=rollback_snapshot', {
            name: snapshotName
        }, function(data) {
            var job = new Job({
                uuid: data.job_uuid
            });

            cb(job);
        });
    },

    deleteSnapshot: function (snapshotName, cb) {
        $.post(this.url() + '?action=delete_snapshot', {
            name: snapshotName
        }, function (data) {
            cb(new Job({
                uuid: data.job_uuid
            }));
        });
    }
});

module.exports = Volume;
