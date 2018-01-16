const controller = require('./dao.server.cron.controller');

exports.insertCrawlData = controller.insertCrawlData;
exports.insertCurrentCrawlData = controller.insertCurrentCrawlData;
exports.findAllPlayer = controller.findAllPlayers;
exports.updateTierData = controller.updateTierData;
exports.doAggregate = controller.doAggregate;

exports.getTodayCrawlDatasCount = controller.getTodayCrawlDatasCount;
exports.dropTodayCollection = controller.dropTodayCollection;

exports.getCrawlDataCount = controller.getCrawlDataCount;

/* for report */
exports.getTierData = controller.getTierData;

exports.updateCurrentCrawlData = controller.updateCurrentCrawlData;

/* for count */
exports.getPlayersCount = controller.getPlayersCount;