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
            thirdColumn : '<',
        }
    })
    .filter('upperNumberFormat', upperNumberFormat)
    .filter('lowerNumberFormat', lowerNumberFormat)
    .filter('percentForResult', percentForResult)
    .filter('percentSymbolForResult', percentSymbolForResult)
    .filter('ptSymbolForResult', ptSymbolForResult)
    .filter('roundUp', roundUpFilter)
    .filter('abs', absFilter)
    .name;

export function controller($element, $scope, AppLogger) {

    const $ctrl = this;
    const logScope = 'compare.table'

    $ctrl.onCompareToggle = onCompareToggle;
    $ctrl.onResultToggle = onResultToggle;

    $ctrl.$onInit = function() {
        init();
        initListener();
        initTable($ctrl.labelColumn, $ctrl.firstColumn, $ctrl.secondColumn, $ctrl.thirdColumn);
    }

    function initListener() {
        $scope.$on("onCompareToggle", function(){
            onCompareToggle();
        });

        $scope.$on("onResultToggle", function(){
            onResultToggle();
        });
    }


    $ctrl.$onChanges = function(changes) {
        const labelCol = $ctrl.labelColumn;
        const firstCol = $ctrl.firstColumn;
        const secondCol = $ctrl.secondColumn;
        const thirdCol = $ctrl.thirdColumn;

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
        const isReady = canInflateTable(labelColumn);
        
        let tableRows;
        if(!isReady) {
            tableRows = convertDatasColumnToRow([], [], [], []); //
            showSelectHeroMessage();
        } else {
            tableRows = convertDatasColumnToRow(labelColumn, firstColumn, secondColumn, thirdColumn);
        }

        $ctrl.tableRows = tableRows;
        AppLogger.log('Init Compare Table Complete', logScope, 'info');
        AppLogger.log($ctrl.tableRows, logScope, 'info');
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

    $ctrl.calcPercent = calcPercent;
    $ctrl.calcDiff = calcDiff;
    $ctrl.getNgClass = getNgClass;

    function calcPercent(a, b) {
        return (a - b) / b;
    }

    function calcDiff(a, b) {
        return a - b;
    }

    function getNgClass(a, b){
        if(a == b) return 'c-green';
        else if (a > b) return 'c-red';
        else if (a < b) return 'c-blue';
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

    function onCompareToggle() {
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

        if(isNaN(input) || input == null){
            return '-';
        }
        
        if(format == undefined) format = '0.00';

        return numeral(input*100).format(format);
    }
}

export function lowerNumberFormat() {
    return function(input, format) {
        
        if(isNaN(input) || input == null){
            return;
        }

        if(format == undefined) format = '0.00';

        return numeral(input).format(format);
    }
}

function percentForResult() {
    return function(input) {

        if(isNaN(input)){
            return '-';
        }

        if(input == Infinity) {
            return '∞';
        }

        return numeral(input*100).format('xx.0');
    }
}

function percentSymbolForResult() {
    return function(input) {

        if(isNaN(input)){
            return '';
        }

        if(input == Infinity) {
            return '';
        }

        return '%';
    }
}

function ptSymbolForResult() {
    return function(input) {

        if(isNaN(input)){
            return '';
        }

        if(input == Infinity) {
            return '';
        }

        return 'pt';
    }
}


function roundUpFilter() {
    return function(input) {
        numeral(input*100).format('xx.0');
    }
}
function absFilter() {
    return function(input) {
        if(isNaN(input)) return input;
        else return Math.abs(input);
    }
}

