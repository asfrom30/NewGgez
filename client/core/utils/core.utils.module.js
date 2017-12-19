'use strict';

import angular from 'angular';

import AppLogger from './logger/logger.core.utils.service';

import moment from 'moment';
import noty from 'noty';
import 'noty/lib/noty.css';

export function ajaxIndicator(msg){

    this.noty = new noty({
        text: msg
    });

    this.show = function(){
        this.noty.setType('error');
        this.noty.show();
    }

    this.hide = function(){
        this.noty.close();
    }
}

export default angular
    .module('core.utils', [AppLogger])
    .service('CoreUtils', function(){

        /* ajaxIndicator */
        this.ajaxIndicator = ajaxIndicator;

        /* Date */
        this.getCurrentIndex = function(){
            return 'current';
        }

        this.getTodayIndex = function(){
            return '171113';
            // return moment().subtract(0, 'days').format('YYMMDD');
        }   

        this.getYesterIndex = function(){
            return '171105';
            // return moment().subtract(1, 'days').format('YYMMDD');
        }
        
        this.getWeekIndex = function(){
            return '171027';
            // return moment().subtract(7, 'days').format('YYMMDD');
        }
        
        this.getDateIndex = function(daysAgo){
            return moment().subtract(daysAgo, 'days').format('YYMMDD');
        }

        /* Noty Util*/
        this.noty = function(msg, type){

            // alert(msg);
            new noty({
                timeout : 500,
                text: msg
            }).show();
        }
    }).name;