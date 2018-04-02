'use strict';

const express = require('express');
const router = express.Router();

const coreController = require('../../../core.api.controller');
const controller = require('./freeboard.controller');

router.param('id', controller.findById);

/* Freeboard Api */
router.get ('/', controller.getPageQuery); // ?page=1
router.get('/:id', controller.read);
router.post('/', coreController.checkAuth, controller.save);
// router.modify('/', controller.update);

router.get('/:id/upvote', coreController.checkAuth, controller.upvote);

module.exports = router;




