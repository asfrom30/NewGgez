import { writeFile } from 'fs';

const fs = require('fs');
const moment = require('moment');
const path = require('path');
const loggerConfig = require('../../../config/config').logger;

exports.log = function(mode, msg) {
    if(process.env.NODE_ENV === mode) console.log(msg);
}

exports.log2File = function(suffix, msg) {
    const logPath = path.join(loggerConfig.basePath, `${loggerConfig.baseName}_${suffix}`);
    if(msg == '') {
        writeCr(logPath);
    } else {
        writeLog(logPath, msg);
    }
}

exports.info = function(mode, msg) {
    if(process.env.NODE_ENV === mode) console.log("\x1b[36m", msg + '\x1b[39m');
}

exports.warn = function(mode, msg) {
    if(process.env.NODE_ENV === mode) console.log("\x1b[33m", msg + '\x1b[39m');
}

exports.err = function(mode, msg) {
    if(process.env.NODE_ENV === mode) console.log("\x1b[31m", msg + '\x1b[39m');
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

// FgBlack = "\x1b[30m"
// FgRed = "\x1b[31m"
// FgGreen = "\x1b[32m"
// FgYellow = "\x1b[33m"
// FgBlue = "\x1b[34m"
// FgMagenta = "\x1b[35m"
// FgCyan = "\x1b[36m"
// FgWhite = "\x1b[37m"