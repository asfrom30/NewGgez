'use strict';

import angular from 'angular';

export function TableChart() {

    var ctrl = this;

    ctrl.$onInit = function() {
        console.log(ctrl.text);
    }

    ctrl.$onChanges = function (changesObj) {
        console.log(changesObj);
        console.log('changes');
    };

    ctrl.testClick = function(){
        ctrl.onTestClick();
    }
    
}

export default angular
    .module('d3.tableChart', [])
    .component('tableChart', {
        template : require("./table-chart.html"),
        controller : TableChart,
        bindings : {
            // testFunction : '&',
            testValue : '@',
            testValue2 : '<',
            onDelete: '&',
            onUpdate: '&',
            text :'@',
            onTestClick : '&'
        }
    }).name;