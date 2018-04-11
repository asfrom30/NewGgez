'use strict';

const express = require('express');
const router = express.Router();

const coreController = require('../../../core.api.controller');
const controller = require('./freeboard.controller');

router.param('id', controller.findById);

/* Freeboard Api */
router.get ('/', controller.query); // ?page=1
router.post('/', coreController.checkAuth, controller.save);

router.get('/:id', controller.read);
router.delete('/:id', coreController.checkAuth, controller.delete);
// modify
router.get('/:id/upvote', coreController.checkAuth, controller.upvote);

module.exports = router;




