'use strict';

import angular from 'angular';

const logLevel = 'info';
const logScopes = ['ajax-service'];

export default angular
    .module('logger.core.utils.service', [])
    .service('AppLogger', function(CommonLogService, CONFIG_LOG){

        // logLevel = [info, warn, error];
        // logScope = [class name];
        this.log = function(msg, logLevel, logScope){
            
            if(process.env.NODE_ENV == 'production') return;

            for(let _logScope of logScopes) {
                if(_logScope == logScope) {
                    console.log(msg)
                    break;
                }
            }
            return;

            if(!CONFIG_LOG.isActivate) return;
            if(CONFIG_LOG.logLevel.includes(logLevel) && CONFIG_LOG.logScope.includes(logScope)){
                CommonLogService.colorLog(msg, logLevel)
            }
        }

        this.table = function(obj, type){
            //if object.... how handle the object...
            // be able to apply scope mode... not color...
            // or table 
            console.table(obj)
        }


    }).name;