const analyzeEngine = require('./analyze-engine');

main();

function main() {
    return Promise.resolve().then(() => {
        return analyzeEngine.analyzeTierDataAsync();
    }).then((result) => {
        return analyzeEngine.analyzeRankingData();
    }).then(() => {
        return analyzeEngine.analyzeRankingData();
    }).then(() => {
        return analyzeEngine.analyzeTierDataAsync();
    });
}

