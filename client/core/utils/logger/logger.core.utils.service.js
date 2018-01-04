'use strict';

import angular from 'angular';

// logLevel = [info, warn, error];
// logScope = [class name];

const logLevel = 'info';
// const logScopes = [];

export default angular
    .module('logger.core.utils.service', [])
    .service('AppLogger', function(CommonLogService, CONFIG_LOG){

        this.log = function(msg, logLevel){

            if(process.env.NODE_ENV == 'production') {
                // using ajax input error message to server, must be specify.
                log2Server(msg, logLevel);
                return;
            } else {
                log2Browser(msg, logLevel);
            }
        }

        this.table = function(obj, type){
            //if object.... how handle the object...
            // be able to apply scope mode... not color...
            // or table 
            console.table(obj)
        }
    }).name;

function log2Server(msg, logLevel, logScope) {

}

function log2Browser(msg, logLevel) {
        console.error(msg);
    return;

    // if(!CONFIG_LOG.isActivate) return;
    // if(CONFIG_LOG.logLevel.includes(logLevel) && CONFIG_LOG.logScope.includes(logScope)){
    //     CommonLogService.colorLog(msg, logLevel)
    // }
}