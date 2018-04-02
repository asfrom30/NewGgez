const passport = require('passport');
const mongoose = require('mongoose');
const LocalStrategy = require('passport-local');

module.exports = function (app) {


    const User = mongoose.model('User');

    // Local Passport Strategy
    passport.use('local.signin', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, function (req, email, password, done) {

        //done(err, user, info);

        req.checkBody('email', 'Invalid email').notEmpty().isEmail();
        req.checkBody('password', 'Invalid password').notEmpty();
        var errors = req.validationErrors();

        if (errors) {
            // handling error;
            return done(null, false, errors);
        }

        User.findOne({ 'email': email }, function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, { msg: 'No user found.' });
            }
            if (!user.validPassword(password)) {
                return done(null, false, { msg: 'Wrong password.' });
            }
            return done(null, user);
        });
    }));


    /** Battlenet */
    var BnetStrategy = require('passport-bnet').Strategy;
    var BNET_ID = process.env.BNET_ID
    var BNET_SECRET = process.env.BNET_SECRET

    // Use the BnetStrategy within Passport.
    const secrets = app.get('secrets').oauth.bnet[process.env.NODE_ENV];

    passport.use(new BnetStrategy({
        region : secrets.region,
        clientID: secrets.clientID,
        clientSecret: secrets.clientSecret,
        callbackURL: secrets.callbackURL,
        passReqToCallback: true
    }, function (req, accessToken, refreshToken, profile, done) {
        req.profile = profile;
        return done(null, profile);
    }));

    /* Use Other Strategy */
    // passport.use(new BnetStrategy({
    // }, function (req, accessToken, refreshToken, profile, done) {
    //TODO: need code find id based on twitter id or facebook id.
    // cf)
    // findOne({facebook_id : facebook_id}).then(user => {
    // return done(null, user.id)
    // })
    // }));

    passport.serializeUser(function (user, done) {
        done(null, user.id); // save in session passport.user = user.id
    });

    passport.deserializeUser(function (id, done) {

        // this excutes when passport-session is already existed
        // passport.user <-- this is id.
        User.findById(id, {_id : 1, email : 1, username : 1, battletag : 1}, function (err, user) {
            done(err, user);
        });
    });


    app.use(passport.initialize());
    app.use(passport.session());
}