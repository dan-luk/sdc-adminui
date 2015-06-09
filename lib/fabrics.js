/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/*
 * Copyright (c) 2015, Joyent, Inc.
 */
function setOwner(req, params) {
    params = params || 'params';
    req[params] = req[params]|| {};
    return req[params].owner_uuid && req[params].owner_uuid !== 'null' && req.session.data.roles.indexOf('operators') !== -1 ? req[params].owner_uuid : req.session.data.user;
}

module.exports.createFabricVlan = function (req, res, next) {
    var owner = setOwner(req, 'body');
    var body = req.body;
    body.vlan_id = body.vlan_id || 0;

    req.sdc[req.dc].napi.createFabricVLAN(owner, body, function (err, job) {
        if (err) {
            req.log.fatal(err, 'Error on creating fabric vlan');
            res.send(err);
            return next(err);
        } else {
            res.send(job);
            return next();
        }
    });
    return next();
};

module.exports.listFabricVlans = function (req, res, next) {
    var owner = setOwner(req);

    req.sdc[req.dc].napi.listFabricVLANs(owner, req.params, function (err, vlans) {
        if (err) {
            req.log.fatal(err);
            return next(err);
        } else {
            res.send(vlans);
            return next();
        }
    });
};

module.exports.updateFabricVlan = function (req, res, next) {
    var id = parseInt(req.params.id, 10);
    var owner = setOwner(req);

    req.sdc[req.dc].napi.updateFabricVLAN(owner, id, req.body, function (err, job) {
        if (err) {
            req.log.fatal(err);
            return next(err);
        } else {
            res.send(job);
            return next();
        }
    });
};

module.exports.getFabricVlan = function (req, res, next) {
    var id = parseInt(req.params.id, 10);
    var owner = setOwner(req);

    req.sdc[req.dc].napi.getFabricVLAN(owner, id, {}, function (err, vlan) {
        if (err) {
            req.log.fatal(err);
            return next(err);
        } else {
            res.send(vlan);
            return next();
        }
    });
};

module.exports.deleteFabricVlan = function (req, res, next) {
    var id = parseInt(req.params.id, 10);
    var owner = setOwner(req, 'body');

    req.sdc[req.dc].napi.deleteFabricVLAN(owner, id, req.body, function (err, obj) {
        if (err) {
            req.log.fatal(err);
            return next(err);
        } else {
            res.send(obj);
            return next();
        }
    });
};


module.exports.listFabricNetworks = function (req, res, next) {
    var owner = setOwner(req);
    var id = parseInt(req.params.id, 10);

    req.sdc[req.dc].napi.listFabricNetworks(owner, id, req.params, function (err, vlans) {
        if (err) {
            req.log.fatal(err);
            return next(err);
        } else {
            res.send(vlans);
            return next();
        }
    });
};

module.exports.createFabricNetwork = function (req, res, next) {
    var owner = setOwner(req);
    var id = parseInt(req.params.id, 10);

    req.sdc[req.dc].napi.createFabricNetwork(owner, id, req.body, function (err, vlans) {
        if (err) {
            req.log.fatal(err);
            return next(err);
        } else {
            res.send(vlans);
            return next();
        }
    });
};

module.exports.getFabricNetwork = function (req, res, next) {
    var owner = setOwner(req);
    var id = parseInt(req.params.id, 10);

    req.sdc[req.dc].napi.getFabricNetwork(owner, id, req.params.uuid, req.params, function (err, vlans) {
        if (err) {
            req.log.fatal(err);
            return next(err);
        } else {
            res.send(vlans);
            return next();
        }
    });
};

module.exports.deleteFabricNetwork = function (req, res, next) {
    var owner = setOwner(req);
    var id = parseInt(req.params.id, 10);

    req.sdc[req.dc].napi.deleteFabricNetwork(owner, id, req.params.uuid, req.params, function (err, vlans) {
        if (err) {
            req.log.fatal(err);
            return next(err);
        } else {
            res.send(vlans);
            return next();
        }
    });
};

