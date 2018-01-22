'use strict';

require('./index.css');

import angular from 'angular';

export default angular
    .module('up.down.symbol.core.feature.module',[])
    .component('upDownSymbol', {
        template :  require('./index.html'),
        controller : controller,
        bindings : {
            value : '<',
        }
    }).name;

function controller ($element) {

    const $ctrl = this;

    $ctrl.$onInit = function() {

    }

    $ctrl.$onChanges = function() {

    }

    $ctrl.getColor = getColor;
    $ctrl.getArrow = getArrow;

    function getArrow() {
        const value = $ctrl.value;

        if(value > 0 ){
            return "▲";
        } else if (value < 0) {
            return "▼";
        } else if (value == 0) {
            return "-"
        } else {
            return
        }
    }

    function getColor() {
        const value = $ctrl.value;

        if(value > 0) {
            return 'arrow-red'
        } else if (value < 0) {
            return 'arrow-blue'
        } else if (value == 0) {
            return 'arrow-green'
        } else {
            return 'arrow-black'
        }
    }

}