'use strict';

import angular from 'angular';

export default angular
    .module('logger.core.utils.service', [])
    .service('AppLogger', function(CommonLogService, /* CONFIG_LOG */){

        this.log = function(msg, logScope, logLevel){
            if(process.env.NODE_ENV == 'production') {
                log2Server(msg, logScope, logLevel);
            } else {
                log2Browser(msg, logScope, logLevel);
            }
        }

        this.table = function(obj, type){
            //if object.... how handle the object...
            // be able to apply scope mode... not color...
            // or table 
            console.table(obj)
        }
    }).name;

function log2Server(msg, logScope, logLevel) {
    // using ajax input error message to server, must be specify.
}

function log2Browser(msg, _logScope, _logLevel) {
    const logFlag = process.env.NODE_ENV !== 'production' ? true : false;
    const logLevel = ['info', 'error']; // logLevel = [info, warn, error];
    const logScopes = ['hero.detail', 'compare.table']; // logScope = [class name];

    if(!logFlag) return;
    if(_logLevel == undefined) return;
    if(_logScope == undefined) return;

    if(logLevel.includes(_logLevel) && logScopes.includes(_logScope)){
        if(_logLevel == 'info') {
            if(msg instanceof Object) console.log(msg);
            else console.log(msg);
        } else if(_logLevel == 'warn') {
            if(msg instanceof Object) console.log(msg);
            else console.warn(msg);
        } else {
            if(msg instanceof Object) console.log(msg);
            else console.error(msg);
        }
        // CommonLogService.colorLog(msg, logLevel)
    }
}
