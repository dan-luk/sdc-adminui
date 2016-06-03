function list(req, res, next) {
    req.sdc[req.dc].volapi.get('/volumes', function (err, _req, _res, volumes) {
        if (err) {
            req.log.error(err, 'Error retrieving Volumes');
            return next(err);
        }
        res.send(volumes);
        return next();
    });
}

function get(req, res, next) {
    req.sdc[req.dc].volapi.get('/volumes' + req.params.uuid, function (err, _req, _res, volume) {
        if (err) {
            req.log.error(err, 'Error retrieving Volume');
            return next(err);
        }
        res.send(volume);
        return next();
    });
}

function create(req, res, next) {

}

function del(req, res, next) {
    req.sdc[req.dc].volapi.del('/volumes' + req.params.uuid, function (err, _req, _res, volume) {
        if (err) {
            req.log.error(err, 'Error deleting Volume');
            return next(err);
        }
        res.send(volume);
        return next();
    });
}

module.exports =  {
        list: list,
        get: get,
        create: create,
        del: del
};
