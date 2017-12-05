const config = require('../../config/enviroment');
const appDao = require('../dao');
const crawlAndSave = require('../crawl-and-save');

exports.getAllPlayerCrawlAndSave = getAllPlayerCrawlAndSave;
exports.getAnalyzeTierData = getAnalyzeTierData;

function getAllPlayerCrawlAndSave(preResult, crawlConfig, saveConfig) {

    /* */

    return new Promise((resolve, reject) => {
        appDao.findAllPlayer(saveConfig.device, saveConfig.region).then((players) => {
            
            /* add dummies for finish mark of promise chain. because of last async */
            players.push({btg : 'dummies for finish flag'});
            const playerNum = players.length;

            players.reduce(function(prePromise, currentValue, currentIndex, array){
                const id = currentValue.id;
                const btg = currentValue.btg;
                return prePromise.then(() => {
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

function getAnalyzeTierData(preResult, onTickEnv) {
    return new Promise((resolve, reject) => {
        setTimeout(function() {
            console.log('analyze tier');
            console.log(preResult);
            resolve(preResult+1);
        }, 1000);
    });
}