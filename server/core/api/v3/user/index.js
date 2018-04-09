'use strict';

const express = require('express');
const router = express.Router();

const coreCtrl = require('../../core.api.controller');
const userCtrl = require('./user.controller');

// router.get('/', coreCtrl.checkAuth, userCtrl.get);
router.get('/', coreCtrl.checkAuth, userCtrl.get);
router.put('/', coreCtrl.checkAuth, userCtrl.update);

router.post('/signup', userCtrl.signup);
router.post('/signin', userCtrl.signin);
router.get('/signout', userCtrl.signout);

router.get('/invitation', userCtrl.createInvitation);
router.get('/status', userCtrl.isSignIn);

module.exports = router;
