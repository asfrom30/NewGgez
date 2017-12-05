/**
 * Version 0.0.2
 */

module.exports = function(msg, color) {
    let colorValue = "\x1b[37m"; // default is White
    switch(color) {
        case 'black' : 
            colorValue =  "\x1b[30m"
            break;
        case 'red' :
            colorValue =  "\x1b[31m"
            break;
        case 'green' :
            colorValue =  "\x1b[32m"
            break;
        case 'yellow' :
            colorValue =  "\x1b[33m"
            break;
        case 'blue' :
            colorValue =  "\x1b[34m"
            break;
        case 'magenta' :
            colorValue =  "\x1b[35m"
            break;
        case 'cyan' :
            colorValue =  "\x1b[36m"
            break;
        case 'white' :
            colorValue =  "\x1b[37m"
            break;
    }
    console.log(colorValue, msg)
}

// exports.logSetting = {
//     prodMode : false,

//     crawlLog : true,
// }

// exports.log = function(msg, tag){
//     let logSetting = this.logSetting;

//     if(logSetting.prodMode) return;

//     let flag = true;

//     switch(tag) {
//         case 'crawl-log' :
//             flag = logSetting.crawlLog;
//             break;
//     }
    
//     if(flag) console.log('\x1b[33m%s\x1b[0m', msg);
// }

// Reset = "\x1b[0m"
// Bright = "\x1b[1m"
// Dim = "\x1b[2m"
// Underscore = "\x1b[4m"
// Blink = "\x1b[5m"
// Reverse = "\x1b[7m"
// Hidden = "\x1b[8m"

// FgBlack = "\x1b[30m"
// FgRed = "\x1b[31m"
// FgGreen = "\x1b[32m"
// FgYellow = "\x1b[33m"
// FgBlue = "\x1b[34m"
// FgMagenta = "\x1b[35m"
// FgCyan = "\x1b[36m"
// FgWhite = "\x1b[37m"

// BgBlack = "\x1b[40m"
// BgRed = "\x1b[41m"
// BgGreen = "\x1b[42m"
// BgYellow = "\x1b[43m"
// BgBlue = "\x1b[44m"
// BgMagenta = "\x1b[45m"
// BgCyan = "\x1b[46m"
// BgWhite = "\x1b[47m"

// console.log('\x1b[36m%s\x1b[0m', 'I am cyan');  //cyan
// console.log('\x1b[33m%s\x1b[0m', stringToMakeYellow);  //yellow