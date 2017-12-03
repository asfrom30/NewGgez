'use strict';

var express = require('express');
var controller = require('./player.profile.server.controller');

var router = express.Router();

router.param('id', controller.findById);

// router.get('/', controller.index);
router.get('/:id', controller.read);





module.exports = router;
