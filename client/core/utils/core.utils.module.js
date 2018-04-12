'use strict';

import angular from 'angular';

import AppLogger from './logger/logger.core.utils.service';

import moment from 'moment';
import noty from 'noty';

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
                return '180210';
            } else {
                return moment().subtract(0+getCalibration(), 'days').format('YYMMDD');
            }
        }   

        this.getYesterIndex = function(){
            if(env != 'production') {
                return '180209';
            } else {
                return moment().subtract(1+getCalibration(), 'days').format('YYMMDD');
            }
        }
        
        this.getWeekIndex = function(){
            if(env != 'production') {
                return '180208';
            } else {
                return moment().subtract(7+getCalibration(), 'days').format('YYMMDD');
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

function getCalibration(){
    const hours = parseInt(moment().format('HH'));
    if(hours < 4) {
        return 1;
    } else {
        return 0;
    }
}