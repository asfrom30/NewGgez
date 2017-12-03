'use strict';

var express = require('express');
var controller = require('./player.server.controller');

var router = express.Router();

router.param('id', players.findById);
router.param('btg', players.findByBtg);

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.upsert);
router.patch('/:id', controller.patch);
router.delete('/:id', controller.destroy);



module.exports = router;
