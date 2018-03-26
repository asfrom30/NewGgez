
const passport = require('passport');

exports.authenticate = function () {
    passport.authenticate('bnet');
}

exports.callback = function (req, res) {
    const profile = req.profile;
    res.render('callback', {result : JSON.stringify(profile)});
}