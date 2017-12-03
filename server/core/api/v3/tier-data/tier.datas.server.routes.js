var tierDatasCtrl = require('../../controllers/tier.datas.server.controller');
var player = require('../../controllers/players.server.controller');

module.exports = function(app) {

    app.route('/tier-datas/')
        .get(tierDatasCtrl.find);
}