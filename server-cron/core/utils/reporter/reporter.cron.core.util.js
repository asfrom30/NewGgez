const writer = require('../writer/writer.cron.core.util');
const appDao = require('../../dao/index');

module.exports = {
    appendLine : appendLine,
    saveTierJson : saveTierJson,
    writeHistoryResult : writeHistoryResult,
    writeMongoResult : writeMongoResult
}

function appendLine(suffix, text) {
    writer.writeReport(suffix, addLineBreak(text));
}

function saveTierJson(filePath, crawlConfig, saveConfig) {
    const device = crawlConfig.device;
    const region = crawlConfig.region;
    const todaySuffix = saveConfig.todaySuffix;
    
    return appDao.getTierData(device, region, todaySuffix).then(doc => {
        writer.write(filePath, JSON.stringify(doc, null, '\t'));
    })
}

function writeHistoryResult(crawlConfig, saveConfig) {
    const suffix = saveConfig.todaySuffix;
    const doc = makeHistoryResultDoc(crawlConfig, saveConfig);

    return new Promise((resolve, reject) => {
        writer.writeReport(suffix, doc);
        resolve();
    });
}

function writeMongoResult(crawlConfig, saveConfig) {
    const suffix = saveConfig.todaySuffix;

    return makeMongoResultDoc(crawlConfig, saveConfig);
}

function makeHistoryResultDoc(crawlConfig, saveConfig) {

    const elapsedTime = getElapsedTime(crawlConfig.startTime);

    let doc = "";

    doc += `\r\n\r\n== log history ==`;
    doc += `\r\ncrawl elapsed time : ${elapsedTime}`;

    
    return doc;
}


function makeMongoResultDoc(crawlConfig, saveConfig) {

    const device = crawlConfig.device;
    const region = crawlConfig.region;
    const todaySuffix = saveConfig.todaySuffix;
    
    let crawlDataCount = appDao.getCrawlDataCount(device, region, todaySuffix);
    const promises = [crawlDataCount];

    return Promise.all(promises).then(result => {
        let doc = "\r\n\r\n== mongo result ==";
        doc += `\r\ncrawled data count : ${result[0]}`;

        writer.writeReport(todaySuffix, doc);
    })
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