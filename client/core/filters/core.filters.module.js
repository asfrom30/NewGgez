import angular from 'angular';
import numeral from 'numeral';

'use strict';

export default angular.module('ggez.core.filter', [])
    .filter('testFilter', function(){
        return function(input, uppercase) {
            input = input || '';
            var out = '';
            for (var i = 0; i < input.length; i++) {
            out = input.charAt(i) + out;
            }
            // conditional based on optional argument
            if (uppercase) {
            out = out.toUpperCase();
            }
            return out;
        }
    })
    // .filter('percent', function(){
    //     return function(value){
    //         if(value && !isNaN(value)){
    //             return numeral(value).format('0.0%');
    //         } else {
    //             return '0';
    //         }
    //     }
    // })
    .filter('percent', percent)
    .filter('numberFormat', numberFormat)
    .filter('heroImageSrc', heroImageSrc)
    .filter('tierImageSrc', tierImageSrc)
    .filter('playGamesLabel', playGamesLabel)
    .filter('prefixPlus', prefixPlus)
    .filter('suffixPercent', suffixPercent)
    .filter('numberFilter', numberFilter)
    .filter('upDownSymbol', upDownSymbol)
    .filter('defaultValue', defaultValue)
    .name;

export function defaultValue() {
    return function(input, defaultValue) {
        if(input == undefined) return defaultValue;
        else return input;
    }
}
export function percent() {
    return function(input, format) {
        
        if(format == undefined) format = '0.0%';

        if(isNaN(input)) return "--";

        return numeral(input).format(format);
    }
}

export function numberFormat() {
    return function(input, format) {
        
        if(format == undefined) format = '0.00';

        if(isNaN(input)) return "-";

        return numeral(input).format(format);
    }
}
export function upDownSymbol() {
    return function(value){
        if(isNaN(value)) return "";
        
        if(value == Infinity) return '';

        else {
            if(value > 0 ){
                return "▲";
            } else if (value < 0) {
                return "▼";
            } else {
                return "-"
            }
        }
    }
}
export function suffixPercent() {
    return function(value) {
        return value + "%";
    }
}
export function numberFilter() {
    return function(value, defaultValue) {
        value = parseInt(value);
        if(Number.isInteger(value)){
            return value; 
        } else {
            if(defaultValue == undefined) return null;
            else return defaultValue;
        }
    }
}

export function prefixPlus() {
    return function(value) {
        if(Number.isInteger(value)){
            if(value > 99) {
                return "+99"
            } else {
                return "+" + value;
            }
        } else {
            return null;
        }
    }
}
export function playGamesLabel() {
    return function(value){
        if(Number.isInteger(value) && value != 0) {
            return "+" + value
        } else {
            return null;
        }
    }

}

export function heroImageSrc() {
    return function(input){
        var result;

        switch(input){
            case "doomfist" : 
                result = "./assets/images/hero-icon/icon-doomfist.png";
                break;
            case "genji" :
                result = "./assets/images/hero-icon/icon-genji.png";
                break;
            case "mccree" :
                result = "./assets/images/hero-icon/icon-mccree.png";
                break;
            case "pharah" :
                result = "./assets/images/hero-icon/icon-pharah.png";
                break;
            case "reaper" : 
                result = "./assets/images/hero-icon/icon-reaper.png";
                break;
            case "soldier76" : 
                result = "./assets/images/hero-icon/icon-soldier76.png";
                break;
            case "sombra" : 
                result = "./assets/images/hero-icon/icon-sombra.png";
                break;
            case "tracer" : 
                result = "./assets/images/hero-icon/icon-tracer.png";
                break;
            case "bastion" : 
                result = "./assets/images/hero-icon/icon-bastion.png";
                break;
            case "hanzo" : 
                result = "./assets/images/hero-icon/icon-hanzo.png";
                break;
            case "junkrat" : 
                result = "./assets/images/hero-icon/icon-junkrat.png";
                break;
            case "mei" : 
                result = "./assets/images/hero-icon/icon-mei.png";
                break;
            case "torbjorn" : 
                result = "./assets/images/hero-icon/icon-torbjorn.png";
                break;
            case "widowmaker" : 
                result = "./assets/images/hero-icon/icon-widowmaker.png";
                break;
            case "dva" : 
                result = "./assets/images/hero-icon/icon-dva.png";
                break;
            case "orisa" : 
                result = "./assets/images/hero-icon/icon-orisa.png";
                break;
            case "reinhardt" : 
                result = "./assets/images/hero-icon/icon-reinhardt.png";
                break;
            case "roadhog" : 
                result = "./assets/images/hero-icon/icon-roadhog.png";
                break;
            case "winston" : 
                result = "./assets/images/hero-icon/icon-winston.png";
                break;
            case "zarya" : 
                result = "./assets/images/hero-icon/icon-zarya.png";
                break;
            case "ana" : 
                result = "./assets/images/hero-icon/icon-ana.png";
                break;
            case "lucio" : 
                result = "./assets/images/hero-icon/icon-lucio.png";
                break;
            case "mercy" : 
                result = "./assets/images/hero-icon/icon-mercy.png";
                break;
            case "symmetra" :
                result = "./assets/images/hero-icon/icon-symmetra.png";
                break;
            case "zenyatta" : 
                result = "./assets/images/hero-icon/icon-zenyatta.png";
                break;
            case "moira" : 
                result = "./assets/images/hero-icon/icon-moira.png";
                break;
            default : 
                result = "./assets/images/hero-icon/icon-default.png";
                break;
            }
        return result;
    }
}

export function tierImageSrc(){
    return function(cptpt) {
        if(1 <= cptpt && cptpt <= 1499) {
            return "./assets/images/tier-icon/bronze-badge.png";
        } else if(1500 <= cptpt && cptpt <= 1999) {
            return "./assets/images/tier-icon/silver-badge.png";
        } else if(2000 <= cptpt && cptpt <= 2499) {
            return "./assets/images/tier-icon/gold-badge.png";
        } else if(2500 <= cptpt && cptpt <= 2999) {
            return "./assets/images/tier-icon/platinum-badge.png";
        } else if(3000 <= cptpt && cptpt <= 3499) {
            return "./assets/images/tier-icon/master-badge.png";
        } else if(3500 <= cptpt && cptpt <= 3999) {
            return "./assets/images/tier-icon/grandmaster-badge.png";
        } else if(4000 <= cptpt && cptpt <= 5000) {
            return "./assets/images/tier-icon/heroic-badge.png";
        } else {
            return "";
        }
    }
}

