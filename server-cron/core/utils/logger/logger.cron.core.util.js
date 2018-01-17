const fs = require('fs');
const moment = require('moment');
const path = require('path');

const logFlag = require('../../../config/enviroment').logFlag;
const loggerConfig = require('../../../config/enviroment').logger;
const commonWriter = require('../../../common/utils/fs/writer.common.util');

exports.log = function(msg, type) {
    if(logFlag.log2Console) log2Console(msg, type);
    if(logFlag.log2File) log2File(msg, type);
    if(logFlag.log2Server) log2Server(msg, type);
}

function log2Console(msg, type) {
    if(type == undefined) type = 'info';

    if(type == 'info') {
        console.log("\x1b[36m", msg + '\x1b[39m');
    } else if(type == 'warn') {
        console.log("\x1b[33m", msg + '\x1b[39m');
    } else if(type == 'error') {
        console.log("\x1b[31m", msg + '\x1b[39m');
    }
}

function log2File(msg) {
    const suffix = getTodaySuffix();
    const logPath = path.join(loggerConfig.basePath, `${loggerConfig.prefix}_${suffix}`);
    commonWriter.write(logPath, msg);
}

function log2Server(msg, type) {

}

function writeCr(path) {

    fs.appendFileSync(path, `\r\n`, function(err) {
        if(err) {
            return console.log(err);
        }
    }); 
}

function writeLog(path, msg) {
    const currentTime = getCurrentTime();

    fs.appendFileSync(path, `\r\n[${currentTime}] ${msg}`, function(err) {
        if(err) {
            return console.log(err);
        }
    }); 
}

function getCurrentTime(){
    const format = 'YY/MM/DD hh:mm:ss';
    return moment().format(format);
}

function getFileName(){
    const suffixFormat = 'YYMMDD';
    const suffix = moment().format(suffixFormat);
    return `log_${suffix}`;
}

function getTodaySuffix() {
    return moment().format('YYMMDD');
}

