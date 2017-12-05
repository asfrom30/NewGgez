exports.log = function(mode, msg) {
    if(process.env.NODE_ENV === mode) console.log(msg);
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

// FgBlack = "\x1b[30m"
// FgRed = "\x1b[31m"
// FgGreen = "\x1b[32m"
// FgYellow = "\x1b[33m"
// FgBlue = "\x1b[34m"
// FgMagenta = "\x1b[35m"
// FgCyan = "\x1b[36m"
// FgWhite = "\x1b[37m"