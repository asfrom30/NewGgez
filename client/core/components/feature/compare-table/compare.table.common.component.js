'use strict'
require('./index.css');

const angular = require('angular');
// const component = require('./compare.table.common.component');

export default angular
    .module('compare.table.common.component.module',[])
    .component('compareTable', {
        template: require('./index.html'),
        controller : controller,
        bindings : {
            header : '<',
            labelColumn : '<',
            firstColumn : '<',
            secondColumn : '<',
            thirdColumn : '<'
        }
    })
    .filter('upperNumberFormat', upperNumberFormat)
    .filter('lowerNumberFormat', lowerNumberFormat)
    .name;

export function controller($element) {
    const $ctrl = this;

    $ctrl.$onInit = function() {
        init();
        initTable($ctrl.labelColumn, $ctrl.firstColumn, $ctrl.secondColumn, $ctrl.thirdColumn);
    }

    $ctrl.$onChanges = function(changes) {
        const labelCol = $ctrl.labelColumn;
        const firstCol = $ctrl.firstColumn;
        const secondCol = $ctrl.secondColumn;
        const thirdCol = $ctrl.thirdColumn;

        // 
        if(labelCol == undefined) {
            showOverlay();
            showPaddingAndHideResultRow();
        } else {
            hideOverlay();
            hidePaddingAndShowResultRow();
        }

        initTable($ctrl.labelColumn, $ctrl.firstColumn, $ctrl.secondColumn, $ctrl.thirdColumn);
    }


    function init(){
        $ctrl.toggleIndex = 0;
        $ctrl.indexes = {a : 1, b : 2};
        $ctrl.isFirstActive = true;
        $ctrl.isSecondActive = true;
    }

    function initTable(labelColumn, firstColumn, secondColumn, thirdColumn){
        const isValid = convertDatasColumnToRowValidCheck(labelColumn, firstColumn, secondColumn, thirdColumn);
        
        let tableRows;
        if(!isValid || labelColumn == 0) {
            tableRows = convertDatasColumnToRow([], [], [], []);
        } else {
            tableRows = convertDatasColumnToRow(labelColumn, firstColumn, secondColumn, thirdColumn);
            
        }

        $ctrl.tableRows = tableRows;
    }


    function convertDatasColumnToRow(labelCol, firstCol, secondCol, thirdCol){

        let tableRows = [];

        for(let i = 0; i < labelCol.length; i++){

            let title = labelCol[i];

            let firstColumn = {};
            if($ctrl.firstColumn != undefined) {
                firstColumn.score = ($ctrl.firstColumn[i] == undefined) ? 'no-game' : $ctrl.firstColumn[i].score;
                firstColumn.point = ($ctrl.firstColumn[i] == undefined) ? 'no-game' : $ctrl.firstColumn[i].point;
            }

            let secondColumn = {};
            if($ctrl.secondColumn != undefined) {
                secondColumn.score = ($ctrl.secondColumn[i] == undefined) ? 'no-game' : $ctrl.secondColumn[i].score;
                secondColumn.point = ($ctrl.secondColumn[i] == undefined) ? 'no-game' : $ctrl.secondColumn[i].point;
            }
            
            let thirdColumn = {};
            if($ctrl.secondColumn != undefined) {
                thirdColumn.score = ($ctrl.thirdColumn[i] == undefined) ? 'no-game' : $ctrl.thirdColumn[i].score;
                thirdColumn.point = ($ctrl.thirdColumn[i] == undefined) ? 'no-game' : $ctrl.thirdColumn[i].point;
            }

            let resultColumn = {};

            tableRows.push([title, firstColumn, secondColumn, thirdColumn, resultColumn]);
        }

        return tableRows;
    }

    function convertDatasColumnToRowValidCheck(labelCol, firstCol, secondCol, thirdCol) {
        if(!Array.isArray(labelCol)) {
            console.log('labelCol is not array. check binding data');
            return false;
        }

        if(labelCol == undefined) {
            console.log('labelCol is not undefined. check binding data');
            return false;
        }

        return true;
    }

    /* View */
    function showOverlay(msg){
        $element.find('.overlay-child').show();
    }

    function hideOverlay(){
        $element.find('.overlay-child').hide();
    }

    function showPaddingAndHideResultRow(){
        $element.find('td.row-padding').show();
        $element.find('td.row-result').hide();
    }
    
    function hidePaddingAndShowResultRow(){
        $element.find('td.row-padding').hide();
        $element.find('td.row-result').show();
    }

    $ctrl.compareToggle = function() {
        if($ctrl.toggleIndex == 2){
            $ctrl.toggleIndex = 0;
        } else {
            $ctrl.toggleIndex += 1;
        }

        const toggleIndex = $ctrl.toggleIndex;
        
        switch (toggleIndex) {
            case 0:
                $ctrl.isFirstActive = true;
                $ctrl.isSecondActive = true;
                $ctrl.isThirdActive = false;
                $ctrl.indexes.a = 1;
                $ctrl.indexes.b = 2;
                break;
            case 1:
                $ctrl.isFirstActive = false;
                $ctrl.isSecondActive = true;
                $ctrl.isThirdActive = true;
                $ctrl.indexes.a = 2;
                $ctrl.indexes.b = 3;
                break;
            case 2:
                $ctrl.isFirstActive = true;
                $ctrl.isSecondActive = false;
                $ctrl.isThirdActive = true;
                $ctrl.indexes.a = 1;
                $ctrl.indexes.b = 3;
                break;
            default:
                break;
        }
    }
}

import numeral from 'numeral';

export function upperNumberFormat() {
    return function(input, format) {
        
        if(input == 'no-game') return input;
        if(isNaN(input)) return "-";
        if(format == undefined) format = '0.00';


        return numeral(input).format(format);
    }
}

export function lowerNumberFormat() {
    return function(input, format) {
        
        if(input == 'no-game') return;
        if(isNaN(input)) return "-";
        if(format == undefined) format = '0.00';
        return numeral(input).format(format);
    }
}