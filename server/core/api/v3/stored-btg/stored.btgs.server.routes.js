var players = require('../../../app/controllers/players.server.controller');

module.exports = function(app) {

    app.route('/stored-btgs/:btg')
        .get(players.read)
        .put(players.register)
        // .post(players.register);

    app.param('btg', players.findByBtg);

}
