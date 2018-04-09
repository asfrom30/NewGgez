'use strict';

const express = require('express');
const router = express.Router();
/**controller dependency */
const coreController = require('../../../core.api.controller');
const freeboardCtrl = require('../freeboard/freeboard.controller');
const freeboardCommentCtrl = require('./freeboard.comment.controller');


/** Param Check */
router.param('id', freeboardCtrl.findById);

/* Http Method Matching */
router.post('/:id/comments', coreController.checkAuth, freeboardCommentCtrl.save);

module.exports = router;

