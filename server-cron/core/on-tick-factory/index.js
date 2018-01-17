import { setTimeout } from 'timers';

const onTickFlags = require('../../config/enviroment').onTickFlags;
const config = require('../../config/enviroment');
const appDao = require('../dao');

const crawlAndSave = require('../crawl-and-save');
const analyzeEngine = require('../analyze-engine');
const momentTz = require('moment-timezone');
const readline = require('readline');
const fs = require('fs');

const commonMailer = require('../../common/utils/mailer/mailer.cron.common.util');
const appMailer = require('../utils/mailer/mailer.cron.core.util');
const path = require('path');
const util = require('util');
const appLogger = require('../utils/logger/logger.cron.core.util');
const appReporter = require('../utils/reporter/reporter.cron.core.util');

exports.addDailyConfig = addDailyConfig;

exports.needToDropTodayCollection = needToDropTodayCollection;
exports.getAllPlayerCrawlAndSave = getAllPlayerCrawlAndSave;
exports.getAnalyzeTierData = getAnalyzeTierData;
exports.makeDiffDatas = makeDiffDatas;
exports.getRanking = getRanking;
exports.timeBuffer = timeBuffer;
exports.buildReport = buildReport;
exports.sendMail = sendMail;

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

function getAllPlayerCrawlAndSave(preResult, crawlConfig, saveConfig, resultConfig) {
    
    const crawlLimitFlag = crawlConfig.limitFlag;
    const crawlLimitNumber = crawlConfig.limitNumber;
    let crawlSpeed = crawlConfig.speed;
    
    const flag = onTickFlags.crawl;
    appLogger.log(`== Crawl Flag is [${flag}], try to crawl [crawlLimitFlag=${crawlLimitFlag}, crawlLimitNumber=${crawlLimitNumber}, crawlSpeed=${crawlSpeed}] ==`, 'info');
    if(!flag) return Promise.resolve();

    return new Promise((resolve, reject) => {
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
                appLogger.log(`All Players Crawl and Save Finish : success`, 'info');
                resultConfig.crawlFlag = 'true';
                resultConfig.crawlResult = 'success';
                resolve();
            }, reason => {
                appLogger.log(`All Players Crawl and Save Finish : fail`, 'info');
                resultConfig.crawlFlag = 'true';
                resultConfig.crawl = 'fail';
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

function getAnalyzeTierData(preResult, crawlConfig, saveConfig, resultConfig) {

    const flag = onTickFlags.tier;
    appLogger.log(`== Tier Flag is [${flag}] ==`, 'info');
    if(!flag) return Promise.resolve();

    const device = saveConfig.device;
    const region = saveConfig.region;
    const suffix = saveConfig.todaySuffix;

    return appDao.getCrawlDataCount(device, region, suffix).then(result => {
        appLogger.log(`onTickTier : Crawled Datas Count is ${result}`, 'info');
        if(result == 0) return Promise.reject('Crawled Datas is 0, no target');
    }).then(result => {
        analyzeEngine.analyzeTierDataAsync(saveConfig);
        
        appLogger.log('analyze tier data success ', 'info')
        resultConfig.tierResult = true;
    }).catch(reason => {
        appLogger.log('analyze tier data failed :: ' + reason, 'error');
        resultConfig.tierResult = false;
    }).then(() => {
        resultConfig.tierFlag = true;
        appLogger.log('== End Tier Data Analyze ==', 'info');
    });
}

function timeBuffer() {
     // timeout buffer for tier aggregate
    return new Promise((resolve, reject)  => {
        setTimeout(function() {
            resolve();
        }, 1000)
    })
}

function buildReport(preResult, crawlConfig, saveConfig, reportConfig) {
    const flag = onTickFlags.report;
    appLogger.log(`== Build Report Flag is [${flag}] ==`, 'info');
    if(!flag) return Promise.resolve();

    return Promise.resolve().then(result => {
         //FIXME : if foward promise has rejection, but keep going to build.
        const filePath = getReportFilePath(saveConfig.todaySuffix)
        return appReporter.writeHistoryResult(filePath, crawlConfig, saveConfig);
    }).then(result => {
        const filePath = getReportFilePath(saveConfig.todaySuffix)
        return appReporter.writeMongoResult(filePath, crawlConfig, saveConfig);
    }).then(result => {
        const filePath = getTierJsonFilePath(saveConfig.todaySuffix)
        return appReporter.saveTierJson(filePath, crawlConfig, saveConfig);
    }).then(result => {
        appLogger.log('== build report success ==', 'info');
    }).catch(reason => {
        appLogger.log('== build report fail ==', 'error');
        console.log(reason);
    })
}

function sendMail(preResult, crawlConfig, saveConfig) {
    const flag = onTickFlags.mail;
    appLogger.log(`== Send Mail Flag is [${flag}] ==`, 'info');
    if(!flag) return Promise.resolve();

    const reportSubject = `daily report from ggezkr : ${saveConfig.todaySuffix}`;
    const suffix = saveConfig.todaySuffix;
    const attachmentFilePaths = [
        getTierJsonFilePath(suffix),
        getReportFilePath(suffix)
    ];

    return Promise.resolve().then(() => {
        appMailer.sendReports(reportSubject, attachmentFilePaths);
        appLogger.log('== Send Mail Success ==', 'info');
    }).catch(reason => {
        appLogger.log('== Send Mail Fail ==', 'error');
        console.log(reason);
    })
}

function notifyCronStart(preResult, crawlConfig, saveConfig){
    appLogger.log(`start cron job [todaySuffix = ${saveConfig.todaySuffix}]`, 'info');
}

function notifyCronFinish(preResult, crawlConfig, saveConfig) {
    appLogger.log(`finish cron job [todaySuffix = ${saveConfig.todaySuffix}]\r\n'`, 'info');
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

function makeDiffDatas(preResult, crawlConfig, saveConfig, resultConfig){
    
    const flag = onTickFlags.diff;
    appLogger.log(`== Diff Datas Flag is [${flag}] ==`, 'info');
    if(!flag) return Promise.resolve();

    const lang = crawlConfig.lang;
    const device = crawlConfig.device;
    const region = crawlConfig.region;
    const diffConfigs = getDiffConfigs(saveConfig.timezone);

    const promises = [];
    for(let diffConfig of diffConfigs) {

        const aggregateDoc = analyzeEngine.makeDiffAggregateDoc(diffConfig, lang);
        
        if(aggregateDoc == undefined) {
            appLogger.log(`MakeDiffDatas OnTick Error : ${diffConfig.saveSuffix} aggregate doc is not created, can't do aggregate`, 'error');
        } else {
            // console.log(util.inspect(aggregateDoc, { depth: null }));
            promises.push(appDao.doAggregate(device, region, diffConfig.suffixA, aggregateDoc));
        }
    }

    return Promise.all(promises).then(result =>{
        resultConfig.diffFlag = true;
        resultConfig.diffResult = true;
        appLogger.log(`MakeDiffDatas OnTick Result : success`, 'info');
    }, reason => {
        resultConfig.diffFlag = true;
        resultConfig.diffResult = false;
        appLogger.log(`MakeDiffDatas OnTick Result : fail`, 'info');
    })
}

function getDiffConfigs(timezone){
    return [
        { saveSuffix : 'yesterday', suffixA : getTodayIndex(timezone), suffixB : getYesterIndex(timezone)},
        { saveSuffix : 'week', suffixA : 'current', suffixB : getWeekIndex(timezone)},
        { saveSuffix : 'today', suffixA : 'current', suffixB : getTodayIndex(timezone)},
    ]
}

function getTodayIndex(timezone){
    const env = process.env.NODE_ENV;
    if(env != 'prodcution') {
        return '171212';
    } else {
        return momentTz().tz(saveConfig.timezone).subtract(0, 'days').format('YYMMDD');
    }
}   

function getYesterIndex(timezone) {
    const env = process.env.NODE_ENV;
    if(env != 'prodcution') {
        return '171027';
    } else {
        return momentTz().tz(saveConfig.timezone).subtract(1, 'days').format('YYMMDD');
    }
}

function getWeekIndex(timezone){
    const env = process.env.NODE_ENV;
    if(env != 'prodcution') {
        return '171104';
    } else {
        return momentTz().tz(saveConfig.timezone).subtract(7, 'days').format('YYMMDD');
    }
}

function getReportFilePath(suffix) {
    const reportConfig = config.report;
    const filePath = getFilePath(reportConfig, suffix);
    return filePath
}
function getTierJsonFilePath(suffix) {
    const jsonConfig = config.report.tierJson;
    const filePath = getFilePath(jsonConfig, suffix);
    return filePath;
}

function getFilePath(fileConfig, suffix){
    const fileDir = `${fileConfig.basePath}`;
    const fileName = `${fileConfig.prefix}_${suffix}.${fileConfig.fileType}`;
    const filePath = path.join(fileDir, fileName);
    return filePath;
}