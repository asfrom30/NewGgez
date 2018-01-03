const controller = require('./dao.server.controller');

exports.getNewPlayerId = controller.getNewPlayerId;

exports.findPlayerById = controller.findPlayerById;
exports.findPlayerByBtg = controller.findPlayerByBtg;

exports.findPlayerBtgById = controller.findPlayerBtgById;

exports.findCrawlDataById = controller.findCrawlDataById;
exports.findCrawlDataByBtg = controller.findCrawlDataByBtg;
exports.findCurrentCrawlDataById = controller.findCurrentCrawlDataById;

exports.insertPlayer = controller.insertPlayer;
exports.insertCurrentCrawlData = controller.insertCurrentCrawlData;
exports.insertTodayCrawlData = controller.insertTodayCrawlData;

exports.findTierDataByDate = controller.findTierDataByDate;

exports.updatePlayer = controller.updatePlayer;
exports.updateCurrentCrawlData = controller.updateCurrentCrawlData;