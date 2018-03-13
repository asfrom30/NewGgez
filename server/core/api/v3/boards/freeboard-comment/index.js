'use strict';

const express = require('express');
const router = express.Router();
/**controller dependency */
const controller = require('./freeboard.comment.server.api.controller');
const coreController = require('../../../core.api.controller');
const freeboardController = require('../freeboard/freeboard.server.api.controller');


/** Preprocessor  */
router.use('', coreController.checkAuth);

/** Param Check */
router.param('id', freeboardController.findById);

/* Http Method Matching */
router.post('/:id/comments', controller.registerComment);

module.exports = router;

