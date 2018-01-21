'use strict';

import angular from 'angular';

export default angular
    .module('logger.core.utils.service', [])
    .service('AppLogger', function(CommonLogService, /* CONFIG_LOG */){

        this.log = function(msg, logFlag, logLevel){
            if(process.env.NODE_ENV == 'production') {
                log2Server(msg, logFlag, logLevel);
            } else {
                log2Browser(msg, logFlag, logLevel);
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

function log2Browser(msg, logFlag, _logLevel) {
    if(!logFlag) return;

    const logLevel = ['info', 'error']; // logLevel = [info, warn, error];

    if(_logLevel == undefined) return;
    
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
}
