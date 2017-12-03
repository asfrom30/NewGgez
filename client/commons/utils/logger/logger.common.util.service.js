'use strcit';

import angular from 'angular';

export default angular
    .module('logger.util.common.util.service',[]) 
    .factory('CommonLogService', CommonLogService)
    .name;

function CommonLogService() {
    return {
        colorLog : colorLog,
    }
}

function colorLog(message, color) {
    
    color = color || "black";

    switch (color) {
        case "success":  
                color = "Green"; 
                break;
        case "info":     
                color = "blue";  
                break;
        case "error":   
                color = "red";     
                break;
        case "warn":  
                color = "Orange";   
                break;
        default: 
                color = color;
    }

    console.log("%c" + message, "color:" + color);
}
