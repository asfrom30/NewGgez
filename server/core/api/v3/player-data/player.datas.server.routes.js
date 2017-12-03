var playerDatas = require('../../controllers/player.datas.server.controller');
var player = require('../../controllers/players.server.controller');

module.exports = function(app) {

    app.route('/player-datas/:id/')
        .get(playerDatas.find);

    app.param('id', player.findById)
}
