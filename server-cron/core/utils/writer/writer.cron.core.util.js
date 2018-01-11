const fs = require('fs');
const path = require('path');
const reportConfig = require('../../../config/enviroment').report;

function writeReport(suffix, text) {
    const filePath = path.join(reportConfig.basePath, `${reportConfig.prefix}_${suffix}.${reportConfig.fileType}`);
    write(filePath, text);
}

function writeLog() {

}

function write(filePath, text) {
    fs.appendFileSync(filePath, text, function(err) {
        if(err) {
            return console.log(err);
        }
    });
}

function writeLine(filePath, text) {

}

module.exports = {
    write : write,
    writeReport : writeReport,
    writeLog : writeLog,
}