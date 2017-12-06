const tierController = require('./tier.analyzer.cron.server.controller');

exports.analyzeTierDataAsync = analyzeTierDataAsync;


function analyzeTierDataAsync (saveConfig){
    return tierController.analyzeAsync(saveConfig);
}

function analyzeRankingData () {

}
