'use strict';

var express = require('express');
var controller = require('./player.server.controller');

var router = express.Router();

router.param('id', controller.findById);

router.get('/', controller.idx);
router.get('/:id', controller.read);
router.post('/', controller.register);

module.exports = router;

// router.param('btg', controller.findByBtg);

// router.get('/:btg', controller.read);
// router.post('/:btg', controller.register);


// app.route('/players/:device/:region/')

// /* Id */
// app.route('/players/')
//     // .post(players.create); // deprecated

// app.route('/players/:id')
//     .get(players.read);

// /* BattleTag */
// app.route('/players/btg/')
//     .post(players.register)                  // Try to register based on Battle Tag
//     // .post(players.testRegister)

// app.route('/players/btg/:btg')
//     .get(players.read);

// app.param('id', players.findById);
// app.param('btg', players.findByBtg);