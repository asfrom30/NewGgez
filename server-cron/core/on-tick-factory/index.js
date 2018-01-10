const config = require('../../config/enviroment');
const appDao = require('../dao');
const appLogger = require('../utils/logger/logger.cron.core.util');
const crawlAndSave = require('../crawl-and-save');
const analyzeEngine = require('../analyze-engine');
const momentTz = require('moment-timezone');
const readline = require('readline');
exports.getOnTickForLast = getOnTickForLast;

exports.needToDropTodayCollection = needToDropTodayCollection;
exports.getAllPlayerCrawlAndSave = getAllPlayerCrawlAndSave;
exports.getAnalyzeTierData = getAnalyzeTierData;
exports.getRanking = getRanking;
exports.sendReport = sendReport;
exports.notifyCronStart = notifyCronStart;
exports.notifyCronFinish = notifyCronFinish;

function needToDropTodayCollection(preResult, crawlConfig, saveConfig) {
    return new Promise((resolve, reject) => {
        const env = process.env.NODE_ENV;
        const todaySuffix = momentTz().tz(saveConfig.timezone).format('YYMMDD');
        if(env == 'development' || env == 'test') {
            appDao.getTodayCrawlDatasCount(crawlConfig.device, crawlConfig.region, todaySuffix).then(result => {

                const rl = readline.createInterface({
                    input: process.stdin,
                    output: process.stdout
                });

                rl.question(
                    `node_env is [${env}], database is [${crawlConfig.device}_${crawlConfig.region}],`
                    + ` collection is [${todaySuffix}],`
                    + ` count is [${result}] `
                    + ` need drop this database?`, (answer) => {
                    
                    rl.close();
                    if(answer == 'y') {
                        appDao.dropTodayCollection(crawlConfig.device, crawlConfig.region, todaySuffix).then(result => {
                            console.log('drop database successful');
                            console.log(result);
                            resolve();
                        }, reason => {
                            console.log('drop database failed');
                            console.log(reason);
                            resolve();
                        });
                    } else {
                        resolve();
                    }
                });
            });
        } else {
            resolve();     
        }
    });
}

function getAllPlayerCrawlAndSave(preResult, crawlConfig, saveConfig) {
    //TODO: SEPARTE SET CONFIG BEFORE ON TICK(makeOnTickConfig)
    saveConfig.todaySuffix = momentTz().tz(saveConfig.timezone).format('YYMMDD');

    return new Promise((resolve, reject) => {
        appDao.findAllPlayer(saveConfig.device, saveConfig.region).then((players) => {

            if(config.crawl.limitPlayer) players = getLimitPlayers(players, config.crawl.limitNumber);
            else console.log('not limited');
            const playerNum = players.length;
            const slicedPlayers = [];
            let speed = config.crawl.speed;
            const unitNumber = playerNum/speed;

            /* build crawl speed */
            if(config.crawl.speed == undefined) {
                speed = 1;
            }
            
            for(let i=0; i < speed; i++){
                if(i == speed -1){ // last sliced player
                    slicedPlayers.push(players.slice(unitNumber*i));
                } else {
                    slicedPlayers.push(players.slice(unitNumber*i, unitNumber*(i+1)));
                }
            }
            
            /* log */
            logForCrawlSpeed(playerNum, slicedPlayers);

            console.log('Get All Player Crawl and Save : player length is ' + players.length);

            const arrPromise =[];
            for(let players of slicedPlayers){
                let promise = getCrawlAndSavePromise(players, crawlConfig, saveConfig);
                arrPromise.push(promise);
            }
            
            Promise.all(arrPromise).then(result =>{
                resolve();
            }, reason => {
                //TODO: HOW TO HANDLE IF CRAWL IS FAILED... SEND TO EMAIL
                console.log('crawling is failed');
                console.log(reason);
                resolve()
            })
        })
    });
}

function getCrawlAndSavePromise(players, crawlConfig, saveConfig){
    return new Promise((resolve, reject) => {

        /* add dummies for finish mark of promise chain. because of last async */
        players.push({btg : 'this battle tag is dummy for finish flag'});
        const playerNum = players.length;

        players.reduce(function(prePromise, currentValue, currentIndex, array){
            const id = currentValue._id;
            const btg = currentValue.btg;
            return prePromise.then(() => {
                /* end of promise chain */
                if(currentIndex == playerNum -1) {
                    console.log('end one of crawl thread task...' + btg);
                    resolve();
                    return;
                }
                // return crawlAndSave.doAsyncTest(id, btg, crawlConfig, saveConfig);
                return crawlAndSave.doAsync(id, btg, crawlConfig, saveConfig);
            })
        }, Promise.resolve());
    })
}

// need only saveConfig
function getAnalyzeTierData(preResult, crawlConfig, saveConfig) {

    // saveConfig.todayCollectionSuffix = momentTz().tz(saveConfig.timezone).format('YYMMDD');
    saveConfig.todaySuffix = '171229';

    const device = saveConfig.device;
    const region = saveConfig.region;
    const suffix = saveConfig.todaySuffix;

    appLogger.log2File(suffix, '');
    appLogger.log2File(suffix, '== Start Tier Data Analyze ==');

    return appDao.getCrawlDataCount(device, region, suffix).then(result => {
        appLogger.log2File(suffix, `Crawled Datas Count is ${result}`);
        if(result == 0) return Promise.reject('Crawled Datas is 0, no target');
    }).then(result => {
        analyzeEngine.analyzeTierDataAsync(saveConfig);
    }).catch(reason => {
        reason = 'analyze tier data failed :: ' + reason;
        appLogger.log2File(suffix, reason);
    }).then(() => {
        appLogger.log2File(suffix, '== End Tier Data Analyze ==');
    });
}

const commonMailer = require('../../common/utils/mailer/mailer.cron.common.util');

const appMailer = require('../utils/mailer/mailer.cron.core.util');
const path = require('path');

function getOnTickForLast(preResult, crawlConfig, saveConfig){
    saveConfig.todaySuffix = '171229';

    const suffix = saveConfig.todaySuffix;
    appLogger.log2File(suffix, '');
    appLogger.log2File(suffix, '== Get On Tier For Last ==');

    return new Promise((resolve, reject) => {
        resolve();
    }).catch(reason=> {
        console.log(reason);
        reason = 'result = failed :: ' + reason;
        appLogger.log2File(suffix, reason);
    }).then(() => {
        appLogger.log2File(suffix, '== Get On Tier For Last ==');
    });
}

function sendReport() {
    return new Promise((resolve, reject) => {
        try {
            const filePath = path.join(__dirname, 'hello.txt');
            appMailer.sendReport('daily report from ggezkr', filePath); // pass resolve and reject?
            // resolve();
        } catch (error){
            console.log('error occured');
            console.log(error);
        }
    });
}

function notifyCronStart(preResult, crawlConfig, saveConfig){
    console.log('start cron job');
    console.log(crawlConfig);
    console.log(saveConfig);
}

function notifyCronFinish(preResult, crawlConfig, saveConfig) {
    console.log('finish cron job');
}

function getRanking(preResult, crawlConfig, saveConfig) {

    const todaySuffix  = '171229';
    // const todaySuffix = saveConfig.todaySuffix;
}

function getLimitPlayers(players, num) {
    const partOfPlayers = [];
    for(let i=0; i < num; i++){
        if(players[i] != undefined) partOfPlayers.push(players[i]);
    }
    return partOfPlayers;
}

function logForCrawlSpeed(playerNum, slicedPlayers){

    console.log('====== log for crawl speed ======');
    console.log('player number is ' + playerNum);
    console.log();

    let tempcount = 0;
    for(let i=0; i < slicedPlayers.length; i++){

        let tempPlayers = slicedPlayers[i];
        let startIndex = 0;
        let endIndex = tempPlayers.length -1;

        console.log(`start id ${tempPlayers[startIndex]._id}, end id ${tempPlayers[endIndex]._id}`);
        tempcount += tempPlayers.length;
    }
    console.log();
    console.log('added all sliced number count is ' + tempcount);
    console.log('====== log for crawl speed ======');
}