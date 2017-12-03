'use strict';

import angular from 'angular';


//todo: Change Modules to ng-table http://ngmodules.org/modules/ng-table
export function TableChart() {

    var ctrl = this;

    ctrl.$onInit = function() {
    }

    ctrl.$onChanges = function (changesObj) {
        // console.log("Table Chart onChanges");
        // console.log(changesObj);
        // console.log(ctrl.dataset);
    };

    ctrl.testClick = function(){
    }

}


export default angular
    .module('d3.tableChart', [])
    .component('tableChart', {
        template : require("./table-chart.html"),
        controller : TableChart,
        bindings : {
            selected : '<',
            dataset : '<'
        }
    }).name;