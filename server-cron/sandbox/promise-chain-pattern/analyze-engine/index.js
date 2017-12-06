const tierController = require('./tier.controller');
const rankingController = require('./ranking.controller')


exports.analyzeTierDataAsync = analyzeTierDataAsync;
exports.analyzeRankingData = analyzeRankingData;


function analyzeTierDataAsync (){
    return tierController.analyzeAsync();
}

function analyzeRankingData () {
    return rankingController.analyzeAsync();
}
