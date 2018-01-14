'use strict';

var express = require('express');
var controller = require('./session.server.controller');

var router = express.Router();

router.get('/favorites', controller.readFavorite);
router.put('/favorites', controller.addFavorite);
router.delete('/favorites', controller.removeFavorite);

router.get('/thumbs', controller.readThumb);
router.put('/thumbs', controller.addThumb);
router.delete('/thumbs', controller.removeThumb);

module.exports = router;