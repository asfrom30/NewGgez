const appDao = require('../../dao/index');
const commonWriter = require('../../../common/utils/fs/writer.common.util');

module.exports = {
    saveTierJson : saveTierJson,
    writeHistoryResult : writeHistoryResult,
    writeMongoResult : writeMongoResult
}

function saveTierJson(filePath, crawlConfig, saveConfig) {
    const device = crawlConfig.device;
    const region = crawlConfig.region;
    const todaySuffix = saveConfig.todaySuffix;
    
    return appDao.getTierData(device, region, todaySuffix).then(doc => {
        if(doc == undefined) commonWriter.write(filePath, `tier_datas_${todaySuffix} is null`);
        else commonWriter.write(filePath, JSON.stringify(doc, null, '\t'));
    })
}

function writeHistoryResult(filePath, crawlConfig, saveConfig) {
    const doc = makeHistoryResultDoc(crawlConfig, saveConfig);
    commonWriter.write(filePath, doc);
}

function writeMongoResult(filePath, crawlConfig, saveConfig) {

    const device = crawlConfig.device;
    const region = crawlConfig.region;
    const todaySuffix = saveConfig.todaySuffix;

    const promises = [];
    promises.push(appDao.getCrawlDataCount(device, region, todaySuffix));
    
    return Promise.all(promises).then(result => {
        let doc = `\r\n\r\n== mongo result == ${todaySuffix}`;
        doc += `\r\ncrawled data count : ${result[0]}`;
        commonWriter.write(filePath, doc);
    })
}

function makeHistoryResultDoc(crawlConfig, saveConfig) {

    const elapsedTime = getElapsedTime(crawlConfig.startTime);

    let doc = "";

    doc += `\r\n\r\n== log history ==`;
    doc += `\r\ncrawl elapsed time : ${elapsedTime}`;

    return doc;
}



function getElapsedTime(startTime){
    if(startTime == undefined) return 'start time is undefined';
    let elapsedTime = Date.now() - startTime;
    return hhmmss(parseInt(elapsedTime/1000));
}

function pad(num) {
    return ("0"+num).slice(-2);
}

function hhmmss(secs) {
    var minutes = Math.floor(secs / 60);
    secs = secs%60;
    var hours = Math.floor(minutes/60)
    minutes = minutes%60;
    return pad(hours)+":"+pad(minutes)+":"+pad(secs);
}

function addLineBreak(text){
    return `\r\n${text}`
}

function addTimeLog(text){

}