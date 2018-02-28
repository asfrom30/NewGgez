'use strict';

var express = require('express');
var controller = require('./freeboard.comment.server.api.controller');

var router = express.Router();


router.post('/:id/comments', controller.save);

module.exports = router;

