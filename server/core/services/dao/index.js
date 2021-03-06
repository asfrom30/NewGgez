const controller = require('./dao.server.controller');

exports.getNewPlayerId = controller.getNewPlayerId;

exports.findPlayerById = controller.findPlayerById;
exports.findPlayerByIds = controller.findPlayerByIds;
exports.findPlayerByBtg = controller.findPlayerByBtg;
exports.findPlayerByRegex = controller.findPlayerByRegex;

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
exports.updateTodayCrawlData = controller.updateTodayCrawlData;

exports.getIndexInformation = controller.getIndexInformation;