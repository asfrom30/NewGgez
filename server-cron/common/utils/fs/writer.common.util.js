const fs = require('fs');
const path = require('path');


exports.write = function(filePath, text) {
    const isExist = makeDirIfNotExist(filePath);
    if(isExist) appendText(filePath, `\r\n${text}`);
    else console.error('can not write in common writer, file is not exist');
}

function makeDirIfNotExist(filePath) {
    var dirname = path.dirname(filePath);
    
    if (fs.existsSync(dirname)) {
        return true;
    }

    fs.mkdirSync(dirname);
    if(fs.existsSync(dirname)) return true;
    else return false;
}

function appendText(filePath, text){
    fs.appendFileSync(filePath, text);
}


// main
