'use strict';

const express = require('express');
const router = express.Router();

const controller = require('./user.controller');

const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('User');



router.post('/signup', function (req, res) {

    const email = req.body.email;
    const userName = req.body.userName;
    const password = req.body.password;
    const passwordConf = req.body.passwordConf;

    // Validation
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('userName', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('passwordConf', 'Passwords do not match').equals(req.body.password);

    const errors = req.validationErrors();

    if (errors) {
        res.status(422).json({ err: errors });
    } else {

        User.findOne({email : email}).then(user => {
            if(user) return res.status(409).json({err : 'this_email_is_already_registered'});

            const newUser = new User({
                email: email,
                username: userName,
                password: password,
            });
    
            newUser.save().then(result => {
                return res.status(200).json({result : true, msg : 'register_success'});
            }, reason => {
                return res.status(500).json({err : 'internal_server_error'});
            })
        });
    }
});

router.post('/signin', function (req, res, next) {
    passport.authenticate('local.signin', function (err, user, info) {

        if (err) { return res.status(500).json({ err : 'internal_server_error' })};
        if(info) { return res.status(422).json({err : 'check_info_message', info : info})};
        if (!user) { return res.status(422).json({ err: 'no_user_found' })};

        req.logIn(user, function (err) {
            if (err) { return res.status(500).json({ err : 'internal_server_error' })}
            return res.json({ result : true });
        });

    })(req, res, next);
});

router.get('/signout', function(req, res, next) {
    req.logout();
    res.json({result : true});
})

router.get('/status', function (req, res, next) {
    if (req.isAuthenticated()) {
        res.json({result : true});
    } else {
        res.json({result : false});
    }
})





module.exports = router;
