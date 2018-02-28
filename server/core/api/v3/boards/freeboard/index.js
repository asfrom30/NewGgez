'use strict';

var express = require('express');
var controller = require('./freeboard.server.api.controller');

var router = express.Router();

router.param('id', controller.findById);

/* Freeboard Api */
router.get('/:id', controller.read);
router.get ('/', controller.query);
router.post('/', controller.save);
// router.modify('/', controller.update);

/* Comment Api */
var commentController = require('./comments/freeboard.comment.server.api.controller');
router.post('/:id/comments', commentController.save);

module.exports = router;


