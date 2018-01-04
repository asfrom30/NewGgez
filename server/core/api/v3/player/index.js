'use strict';

var express = require('express');
var controller = require('./player.server.controller');

var router = express.Router();

router.param('id', controller.findById);

router.get('/', controller.query);  // query string... /?btg=
router.get('/:id', controller.read);
router.put('/', controller.register);

module.exports = router;