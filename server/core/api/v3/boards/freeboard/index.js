'use strict';

const express = require('express');
const router = express.Router();

const controller = require('./freeboard.server.api.controller');

router.param('id', controller.findById);

/* Freeboard Api */
router.get ('/', controller.query); // ?page=1
router.get('/:id', controller.read);
router.post('/', controller.save);
// router.modify('/', controller.update);

module.exports = router;


