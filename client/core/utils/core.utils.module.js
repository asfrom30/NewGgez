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

        const env = process.env.NODE_ENV;
        /* ajaxIndicator */
        this.ajaxIndicator = ajaxIndicator;

        /* Date */
        this.getCurrentIndex = function(){
            return 'current';
        }

        this.getTodayIndex = function(){
            if(env != 'production') {
                return '171212';
            } else {
                return moment().subtract(0, 'days').format('YYMMDD');
            }
        }   

        this.getYesterIndex = function(){
            if(env != 'production') {
                return '171113';
            } else {
                return moment().subtract(1, 'days').format('YYMMDD');
            }
        }
        
        this.getWeekIndex = function(){
            if(env != 'production') {
                return '171104';
            } else {
                return moment().subtract(7, 'days').format('YYMMDD');
            }
        }
        
        this.getDateIndex = function(daysAgo){
            return moment().subtract(daysAgo, 'days').format('YYMMDD');
        }

        /* Noty Util*/
        this.noty = function(msg, type){

            if(type == undefined) type = info;
            // alert(msg);
            new noty({
                theme : 'sunset',
                type : type,
                timeout : 1500,
                text: msg,
            }).show();
        }
    }).name;