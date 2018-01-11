import { setTimeout } from 'timers';

const config = require('../../config/enviroment');
const appDao = require('../dao');
const appLogger = require('../utils/logger/logger.cron.core.util');
const crawlAndSave = require('../crawl-and-save');
const analyzeEngine = require('../analyze-engine');
const momentTz = require('moment-timezone');
const readline = require('readline');

exports.addDailyConfig = addDailyConfig;

exports.needToDropTodayCollection = needToDropTodayCollection;
exports.getAllPlayerCrawlAndSave = getAllPlayerCrawlAndSave;
exports.getAnalyzeTierData = getAnalyzeTierData;
exports.getRanking = getRanking;
exports.sendReport = sendReport;

exports.notifyCronStart = notifyCronStart;
exports.notifyCronFinish = notifyCronFinish;

function addDailyConfig(preResult, crawlConfig, saveConfig){
    saveConfig.todaySuffix = momentTz().tz(saveConfig.timezone).format('YYMMDD');

    crawlConfig.speed = config.crawl.speed;
    crawlConfig.limitFlag = config.crawl.limitFlag;
    crawlConfig.limitNumber = config.crawl.limitNumber;

    crawlConfig.startTime = Date.now();
    crawlConfig.logFlag = config.crawl.logFlag;
}

function getAllPlayerCrawlAndSave(preResult, crawlConfig, saveConfig) {
    const crawlLimitFlag = crawlConfig.limitFlag;
    const crawlLimitNumber = crawlConfig.limitNumber;
    let crawlSpeed = crawlConfig.speed;

    return new Promise((resolve, reject) => {

        const crawlFlag = config.crawl.flag;
        if(!crawlFlag) {
            resolve();
            return;
        }

        appDao.findAllPlayer(saveConfig.device, saveConfig.region).then( players => {

            if(crawlLimitFlag) players = getLimitPlayers(players, crawlLimitNumber);
            const playerNum = players.length;
            
            /* build crawl speed */
            if(crawlSpeed == undefined) crawlSpeed = 1;
            const slicedPlayers = getSlicedPlayers(players, crawlSpeed);
            
            /* log */
            logForCrawlSpeed(playerNum, slicedPlayers);

            const arrPromise =[];
            for(let players of slicedPlayers){
                let promise = getCrawlAndSavePromise(players, crawlConfig, saveConfig);
                arrPromise.push(promise);
            }

            Promise.all(arrPromise).then(result => {
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
const appReporter = require('../utils/reporter/reporter.cron.core.util');

function sendReport(preResult, crawlConfig, saveConfig) {

    const reportSubject = `daily report from ggezkr : ${saveConfig.todaySuffix}`
    const reportFilePath = path.join(config.report.basePath, `${config.report.prefix}_${saveConfig.todaySuffix}.${config.report.fileType}`);
    const reportTierJsonPath = path.join(config.report.basePath, `${config.report.tierPrefix}_${saveConfig.todaySuffix}.json`);

    return Promise.resolve().then(() => {
        // timeout buffer for tier aggregate
        return new Promise((resolve, reject) => {
            setTimeout(function(){
                resolve();
            }, 1000);
        })
    }).then(() => {
        return appReporter.saveTierJson(reportTierJsonPath, crawlConfig, saveConfig);
    }).then(() => {
        return appReporter.writeHistoryResult(crawlConfig, saveConfig);
    }).then(() => {
        return appReporter.writeMongoResult(crawlConfig, saveConfig);
    }).then(() => {
        const attachmentFilePaths = [reportFilePath, reportTierJsonPath];
        //TODO: not yet impl promise pattern. pass resolve and reject?
        appMailer.sendReports(reportSubject, attachmentFilePaths);
    }).catch(reason => {
        console.error('Error Occured in send report promise chain');
        console.log(reason);
    })
}

function notifyCronStart(preResult, crawlConfig, saveConfig){
    console.log(`start cron job [todaySuffix = ${saveConfig.todaySuffix}]`);
}

function notifyCronFinish(preResult, crawlConfig, saveConfig) {
    console.log(`finish cron job [todaySuffix = ${saveConfig.todaySuffix}]\r\n'`)
}

function getRanking(preResult, crawlConfig, saveConfig) {

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


function logCrawlAndSave(){

}

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

function getSlicedPlayers(players, crawlSpeed){

    const playerNum = players.length;
    const unitNumber = playerNum/crawlSpeed;
    const slicedPlayers = [];
    for(let i=0; i < crawlSpeed; i++){
        if(i == crawlSpeed -1){ // last sliced player
            slicedPlayers.push(players.slice(unitNumber*i));
        } else {
            slicedPlayers.push(players.slice(unitNumber*i, unitNumber*(i+1)));
        }
    }

    return slicedPlayers;
}
