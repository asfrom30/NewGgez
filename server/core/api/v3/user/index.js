'use strict';

const express = require('express');
const router = express.Router();
const userCtrl = require('./user.controller');

router.get('/', userCtrl.get);
router.put('/', userCtrl.update);

router.post('/signup', userCtrl.signup);
router.post('/signin', userCtrl.signin);
router.get('/signout', userCtrl.signout);

router.get('/invitation', userCtrl.createInvitation);
router.get('/status', userCtrl.checkStatus);

module.exports = router;
