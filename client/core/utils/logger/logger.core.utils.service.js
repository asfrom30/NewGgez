'use strict';

import angular from 'angular';

export default angular
    .module('logger.core.utils.service', [])
    .service('AppLogger', function(CommonLogService, CONFIG_LOG){


        this.log = function(msg, type, scope){
            if(!CONFIG_LOG.isActivate) return;
            if(CONFIG_LOG.logLevel.includes(type) && CONFIG_LOG.logScope.includes(scope)){
                CommonLogService.colorLog(msg, type)
            }
        }

        this.table = function(obj, type){
            //if object.... how handle the object...
            // be able to apply scope mode... not color...
            // or table 
            console.table(obj)
        }


    }).name;