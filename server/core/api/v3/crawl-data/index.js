'use strict';

var express = require('express');
var controller = require('./crawl.data.server.controller');

var router = express.Router();

router.param('id', controller.storedId);

router.get('/', function(req, res, next){
    res.send({});
})

router.get('/:id', controller.query);

module.exports = router;