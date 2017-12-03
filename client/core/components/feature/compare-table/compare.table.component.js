'use strict';

import angular from 'angular';
require('./compare.table.css');

export default angular
    .module('app.component.compare.table', [])
    .component('compareTable', {
        template : require("./compare.table.html"),
        controller : CompareTable,
        bindings : {
            labelColumn : '<',
            firstColumn : '<',
            secondColumn : '<',
            thirdColumn : '<',
        }
    }).name;


//TODO: Change Modules to ng-table http://ngmodules.org/modules/ng-table
export function CompareTable(CoreUtils) {

    var $ctrl = this;

    $ctrl.$onInit = function() {

    }

    $ctrl.$onChanges = function (changesObj) {
        makeTable();
    };

    function makeTable(){
        $ctrl.tableDatas = [];
        for(let i = 0; i < $ctrl.labelColumn.length; i++){

            let title = $ctrl.labelColumn[i];

            let firstColumn = {};
            if($ctrl.firstColumn != undefined) {
                firstColumn.score = $ctrl.firstColumn[i].score;
                firstColumn.point = $ctrl.firstColumn[i].point;
            }

            let secondColumn = {};
            if($ctrl.secondColumn != undefined) {
                secondColumn.score = ($ctrl.secondColumn[i] == undefined) ? 0 : $ctrl.secondColumn[i].score;
                secondColumn.point = ($ctrl.secondColumn[i] == undefined) ? 0 : $ctrl.secondColumn[i].point;
            }
            
            let thirdColumn = {};
            if($ctrl.secondColumn != undefined) {
                thirdColumn.score = ($ctrl.thirdColumn[i] == undefined) ? 0 : $ctrl.thirdColumn[i].score;
                thirdColumn.point = ($ctrl.thirdColumn[i] == undefined) ? 0 : $ctrl.thirdColumn[i].point;
            }

            let resultColumn = {};

            $ctrl.tableDatas.push([title, firstColumn, secondColumn, thirdColumn, resultColumn]);
        }
        
    }

}


