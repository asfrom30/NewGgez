'use strict';

const express = require('express');
const router = express.Router();

const bnetController = require('./bnet/oauth.bnet.api.controller');


const passport = require('passport');

router.get('/bnet', passport.authenticate('bnet'));
router.get('/bnet/callback', passport.authenticate('bnet',  { failureRedirect: '/', session : false }), bnetController.callback);

module.exports = router;
