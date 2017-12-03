var players = require('../../../app/controllers/players.server.controller');

module.exports = function(app) {

    app.route('/players/:device/:region/')

    /* Id */
    app.route('/players/')
        // .post(players.create); // deprecated

    app.route('/players/:id')
        .get(players.read);

    /* BattleTag */
    app.route('/players/btg/')
        .post(players.register)                  // Try to register based on Battle Tag
        // .post(players.testRegister)

    app.route('/players/btg/:btg')
        .get(players.read);

    app.param('id', players.findById);
    app.param('btg', players.findByBtg);
}
