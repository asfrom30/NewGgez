'use strict';

var express = require('express');
var controller = require('./tier.data.server.controller');

var router = express.Router();

router.param('date', controller.storeDate);

router.get('/:date', controller.query);  // query string... /?btg=

module.exports = router;

