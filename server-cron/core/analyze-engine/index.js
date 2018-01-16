const tierController = require('./tier.analyzer.cron.server.controller');
const diffController = require('./diff.analyzer.cron.server.controller');
// const rankController = require('./')

exports.analyzeTierDataAsync = analyzeTierDataAsync;
exports.makeDiffAggregateDoc = diffController.makeDiffAggregateDoc;


function analyzeTierDataAsync (saveConfig){
    return tierController.analyzeAsync(saveConfig);
}
