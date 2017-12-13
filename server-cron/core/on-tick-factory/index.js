const config = require('../../config/enviroment');
const appDao = require('../dao');
const crawlAndSave = require('../crawl-and-save');
const analyzeEngine = require('../analyze-engine');
const momentTz = require('moment-timezone');

exports.getAllPlayerCrawlAndSave = getAllPlayerCrawlAndSave;
exports.getAnalyzeTierData = getAnalyzeTierData;

function getAllPlayerCrawlAndSave(preResult, crawlConfig, saveConfig) {
    //TODO: SEPARTE SET CONFIG BEFORE ON TICK(makeOnTickConfig)
    saveConfig.todaySuffix = momentTz().tz(saveConfig.timezone).format('YYMMDD');

    return new Promise((resolve, reject) => {
        appDao.findAllPlayer(saveConfig.device, saveConfig.region).then((players) => {

            /* If development mode */
            const nodeEnv = process.env.NODE_ENV;
            if(nodeEnv == 'development' || nodeEnv == 'test') {
                const partOfPlayers = [];
                for(let i=0; i < 100; i++){
                    if(players[i] != undefined) partOfPlayers.push(players[i]);
                }
                players = partOfPlayers;
            }

            console.log('Get All Player Crawl and Save : player length is ' + players.length);
            
            /* add dummies for finish mark of promise chain. because of last async */
            players.push({btg : 'dummies for finish flag'});
            const playerNum = players.length;

            players.reduce(function(prePromise, currentValue, currentIndex, array){
                const id = currentValue._id;
                const btg = currentValue.btg;
                return prePromise.then(() => {
                    /* end of promise chain */
                    if(playerNum == currentIndex+1) {
                        console.log('end task...' + btg);
                        resolve(); // end task
                        return;
                    }
                    return crawlAndSave.doAsync(id, btg, crawlConfig, saveConfig);
                })
            }, Promise.resolve());
        })
    });
}

function getAnalyzeTierData(preResult, crawlConfig, saveConfig) {

    // saveConfig.todayCollectionSuffix = momentTz().tz(saveConfig.timezone).format('YYMMDD');

    return Promise.resolve().then(() => {
        return analyzeEngine.analyzeTierDataAsync(saveConfig);
    }).then((tierData) => {
        return Promise.resolve();
        // return appDao.insertTierData(saveConfig.device, saveConfig.region, tierData);
    }).catch((reason) => {
        console.log('can not create analyze tier data');
        console.log(reason);
    })
}