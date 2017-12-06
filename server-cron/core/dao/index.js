const controller = require('./dao.server.cron.controller');

exports.insertCrawlData = controller.insertCrawlData;
exports.findAllPlayer = controller.findAllPlayers;
exports.updateTierData = controller.updateTierData;
exports.doAggregate = controller.doAggregate;
