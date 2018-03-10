'use strict';

const express = require('express');
const controller = require('./user.controller');
const passport = require('passport');
const router = express.Router();


router.post('/signup', function (req, res) {

    const name = req.body.name;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const password2 = req.body.password2;

    // Validation
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

    const errors = req.validationErrors();

    if (errors) {
        res.status(422).json({ err: errors });
    } else {
        const newUser = new User({
            name: name,
            email: email,
            username: username,
            password: password,
        });

        User.createUser(newUser, function (err, user) {
            if (err) throw err;
            console.log(user);
        })
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
