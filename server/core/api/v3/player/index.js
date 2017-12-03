'use strict';

var express = require('express');
var controller = require('./player.server.controller');

var router = express.Router();

router.param('btg', controller.findByBtg);

router.get('/:btg', controller.read);
router.post('/:btg', controller.register);

module.exports = router;
