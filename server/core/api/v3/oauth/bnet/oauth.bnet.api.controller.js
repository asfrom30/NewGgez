
const passport = require('passport');

exports.authenticate = function () {
    passport.authenticate('bnet');
}

exports.callback = function callback(req, res) {
    const profile = req.profile;
    res.json({profile : profile});
}