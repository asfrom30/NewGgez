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
            tableHeader : '<',
            labelColumn : '<',
            firstColumn : '<',
            secondColumn : '<',
            thirdColumn : '<'
        }
    })
    .filter('upperNumberFormat', upperNumberFormat)
    .filter('lowerNumberFormat', lowerNumberFormat)
    .filter('percentForResult', percentForResult)
    .name;

export function controller($element) {

    const $ctrl = this;

    /* TODO: below code must move to util module */
    $ctrl.console = function() {

        const input = $ctrl.input;
        const indexes = input.split('.');
        let resultObj = $ctrl;
        for(let index of indexes) {
            if(index == '$ctrl') continue;
            resultObj = resultObj[index];
        }
        console.log(resultObj);
    }
    
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

    $ctrl.compareToggle = compareToggle;
    $ctrl.onResultToggle = onResultToggle;

    function init(){
        $ctrl.toggleIndex = 0;
        $ctrl.indexes = {a : 1, b : 2};
        $ctrl.isFirstActive = true;
        $ctrl.isSecondActive = true;
    }

    function initTable(labelColumn, firstColumn, secondColumn, thirdColumn){
        const isReady = canInflateTable(labelColumn);
        
        let tableRows;
        if(!isReady) {
            tableRows = convertDatasColumnToRow([], [], [], []); //
            showSelectHeroMessage();
        } else {
            tableRows = convertDatasColumnToRow(labelColumn, firstColumn, secondColumn, thirdColumn);
        }

        $ctrl.tableRows = tableRows;
        console.log($ctrl.tableRows)
    }

    function getLabelColumn() {
        return $ctrl.labelColumn;
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
            if($ctrl.thirdColumn != undefined) {
                thirdColumn.score = ($ctrl.thirdColumn[i] == undefined) ? 'no-game' : $ctrl.thirdColumn[i].score;
                thirdColumn.point = ($ctrl.thirdColumn[i] == undefined) ? 'no-game' : $ctrl.thirdColumn[i].point;
            }

            let resultColumn = {};

            tableRows.push([title, firstColumn, secondColumn, thirdColumn, resultColumn]);
        }

        return tableRows;
    }

    function canInflateTable(labelCol) {
        if(labelCol == undefined || !Array.isArray(labelCol)) {
            console.error('table inflate is not ready, label column is undefined or not array');
            return false;
        } else {
            return true;
        }
    }

    /* View */
    function showSelectHeroMessage(){

    }
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

    function onResultToggle() {
        $element.find('td .result-percent').toggle();
        $element.find('td .result-diff').toggle();
    }

    function compareToggle() {
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

        if(isNaN(input)){
            console.warn(input);
            return '-';
        }
        
        if(format == undefined) format = '0.00';

        return numeral(input*100).format(format);
    }
}

export function lowerNumberFormat() {
    return function(input, format) {
        
        if(isNaN(input)){
            console.warn(input);
            return;
        }

        if(format == undefined) format = '0.00';

        return numeral(input).format(format);
    }
}

function percentForResult() {
    return function(input) {
        
        if(isNaN(input)){
            console.warn(input);
            return '-';
        }

        return numeral(input*100).format('xx.0');
    }
}
