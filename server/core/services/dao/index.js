const controller = require('./dao.server.controller');

exports.getNewPlayerId = controller.getNewPlayerId;

exports.findPlayerById = controller.findPlayerById;
exports.findPlayerByBtg = controller.findPlayerByBtg;

exports.findCrawlDataById = controller.findCrawlDataById;
exports.findCrawlDataByBtg = controller.findCrawlDataByBtg;

exports.insertPlayer = controller.insertPlayer;
exports.insertCurrentCrawlData = controller.insertCurrentCrawlData;
exports.insertTodayCrawlData = controller.insertTodayCrawlData;

exports.findTierDataByDate = controller.findTierDataByDate;