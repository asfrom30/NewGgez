/* Hero Data Parser */

'use strict';

import angular from 'angular';


export default angular
    .module('app.utils.custom.parser', [])
    .service('CustomParser', function(){

        /* Timestamp Parser */
        this.parseTs = parseTs;
    }).name;

export function parseTs(input){
    
    let target = "%timestamp";

    if(input.indexOf(target) == -1) {
        return null;
    } else {
        return input.substring(0, input.indexOf(target));
    }
    return 
}

