/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/*
 * Copyright (c) 2015, Joyent, Inc.
 */

var Backbone = require('backbone');
var Model = require('./model');

module.exports = Model.extend({
    url: function () {
        if (this.get('owner_uuid') && this.get('vlan_id') || this.get('vlan_id') >= 0) {
            return _.str.sprintf('/api/fabrics/%s/vlan/%s', this.get('owner_uuid'), this.get('vlan_id'));
        } else if (this.get('vlan_id') || this.get('vlan_id') >= 0) {
            return _.str.sprintf('/api/fabrics/vlan/%s', this.get('vlan_id'));
        }
        return _.str.sprintf('/api/fabrics/vlan');
    },
    urlRoot: function () {
        return '/api/fabrics/vlan'
    },
    idAttribute: 'vlan_id'
});

