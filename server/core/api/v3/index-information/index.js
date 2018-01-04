'use strict';

var express = require('express');
var controller = require('./index.information.server.controller');

var router = express.Router();

router.get('/', controller.read);

module.exports = router;