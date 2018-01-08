module.exports = function(logScope) {
    
    this.logScope = logScope;
    
    this.log = function(msg, logLevel){
        if(process.env.NODE_ENV == 'production') {
            log2Server(msg, this.logScope, logLevel);
        } else {
            log2Browser(msg, this.logScope, logLevel);
        }
    }

    this.table = function(obj, type){
        //if object.... how handle the object...// be able to apply scope mode... not color...// or table 
        console.table(obj)
    }
}

const logFlag = false;
const logLevels = ['info', 'warn', 'error']; // logLevel = [info, warn, error];
const logScopes = [/* 'analyzer' */ ]; // logScope = [class name];

function log2Server(msg, logScope, logLevel) {
    // using ajax input error message to server, must be specify.
}

function log2Browser(msg, logScope, logLevel) {
    if(logFlag) return;
    if(logLevel == undefined) return;
    if(logScope == undefined) return;

    if(logLevels.includes(logLevel) && logScopes.includes(logScope)){
        console.error(msg);
        // CommonLogService.colorLog(msg, logLevel)
    }
}