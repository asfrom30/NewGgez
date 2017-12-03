exports.findById = function(req, res, next, id) {
    const device = req.device;
    const region = req.region;
    const Player = require('mongoose').model(`Player_${device}_${region}`);

    Player.findOne({
        _id : id
    }, function(err, player) {
        if(err) {
            return next(err);
        } else {
            req.player = player;
            next();
        }
    })
}

exports.read = function(req, res, next) {
    res.send(req.player);
}
