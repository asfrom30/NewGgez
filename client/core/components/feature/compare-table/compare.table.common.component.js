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
            statIndexes : '<',
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
    .name;

export function controller($element, $scope, AppLogger) {

    const $ctrl = this;
    const logFlag = false;
    const logScope = 'compare.table'
    
    $ctrl.lang = 'kr';
    $ctrl.onCompareToggle = onCompareToggle;
    $ctrl.onResultToggle = onResultToggle;

    $ctrl.$onInit = function() {
        $ctrl.bind = {};
        init();
        initListener();
    }

    function initListener() {
        $scope.$on("onChangeTableResultUnit", function(event, params) {
            const unit = params.unit;
            if(unit == 'percent') {
                onResultPercentShow();
            } else if(unit == 'subtract') {
                onResultSubtractShow();
            }
        });

        $scope.$on("onChangeTableColumnSelected", function(event, params) {
            const direction = params.direction;
            if(direction == undefined) return;
            onChangeTableColumnSelected(direction);
        })
        
        $scope.$on("onCompareToggle", function(){
            onCompareToggle();
        });

        $scope.$on("onResultToggle", function(){
            onResultToggle();
        });
    }


    $ctrl.$onChanges = function(changes) {
        const statIndexes = $ctrl.statIndexes;
        const labelCol = $ctrl.labelColumn;
        const tableHeader = $ctrl.tableHeader;
        const firstColumn = $ctrl.firstColumn;
        const secondColumn = $ctrl.secondColumn;
        const thirdColumn = $ctrl.thirdColumn;

        console.log(tableHeader);
        if(statIndexes == undefined || !Array.isArray(labelCol)) {
            AppLogger.log('statIndexes is undefined, can not inflate table', logFlag, 'warn');
            showOverlay();
            showPaddingAndHideResultRow();
            $ctrl.tableRows = convertDatasColumnToRow([], [], [], []);
        } else {
            AppLogger.log('statIndexes in defined, try to flate table', logFlag, 'info');
            hideOverlay();
            hidePaddingAndShowResultRow();
            $ctrl.tableRows = convertDatasColumnToRow(statIndexes, firstColumn, secondColumn, thirdColumn);
            $ctrl.bind.tableFooters = makeFooters(statIndexes, tableHeader, firstColumn, secondColumn, thirdColumn);
            console.log($ctrl.bind.tableFooters);
        }

        // initTable(statIndexes, $ctrl.firstColumn, $ctrl.secondColumn, $ctrl.thirdColumn);
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
        AppLogger.log('Init Compare Table Complete', logFlag, 'info');
        AppLogger.log($ctrl.tableRows, logFlag, 'info');
    }

    function getLabelColumn() {
        return $ctrl.labelColumn;
    }

    function getColumnScore(column, statIndex) {
        try {
            let result = column[statIndex].score;
            result = parseFloat(result);
            if(isNaN(result)) return undefined;
            else return result;
        } catch (error) {
            return undefined;
        }
    }

    function getColumnPoint(column, statIndex) {
        try {
            let result = column[statIndex].point;
            result = parseFloat(result);
            if(isNaN(result)) return undefined;
            else return result;
        } catch (error) {
            return undefined;
        }
    }


    function convertDatasColumnToRow(statIndexes, firstColumn, secondColumn, thirdColumn){

        let tableRows = [];
        for(const statIndex of statIndexes) {
            tableRows.push([
                statIndex, {
                    score : getColumnScore(firstColumn, statIndex),
                    point : getColumnPoint(firstColumn, statIndex)
                }, {
                    score : getColumnScore(secondColumn, statIndex),
                    point : getColumnPoint(secondColumn, statIndex),
                }, {
                    score : getColumnScore(thirdColumn, statIndex),
                    point : getColumnPoint(thirdColumn, statIndex),
                }, {
                    // result column
                }]);
        }
        return tableRows;
    }

    function makeFooters(statIndexes, tableHeader, firstColumn, secondColumn, thirdColumn) {
        
        let count = 0;
        let p1PointSum = 0;
        let p2PointSum = 0;
        let tierPointSum = 0;

        for(const statIndex of statIndexes) {
            const p1Point = getColumnPoint(firstColumn, statIndex);
            const p2Point = getColumnPoint(secondColumn, statIndex);
            const tierPoint = getColumnPoint(thirdColumn, statIndex);

            if(p1Point && p2Point && tierPoint) {
                count ++;
                p1PointSum += p1Point;
                p2PointSum += p2Point;
                tierPointSum += tierPoint;
            }
        }

        return [
            {headerA : '', headerB : '', value : calcIncrease(p1PointSum, p2PointSum)},
            {headerA : '', headerB : '', value : calcIncrease(p1PointSum, tierPointSum)},
            {headerA : '', headerB : '', value : calcIncrease(p2PointSum, tierPointSum)},

        ];
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

    function calcIncrease (a, b) {
        if(!(a || b)) return undefined;
        const result = (a - b) / b;
        if(isNaN(result) || !isFinite(result)) return undefined;

        return result;
    }

    function calcPercent(a, b) {
        return (a - b) / b;
    }

    function calcDiff(a, b) {
        return a - b;
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

    function onResultPercentShow() {
        $element.find('td .result-percent').show();
        $element.find('td .result-diff').hide();
    }

    function onResultSubtractShow(){
        $element.find('td .result-percent').hide();
        $element.find('td .result-diff').show();
    }

    function onChangeTableColumnSelected(direction) {
        
        if(direction == 'left'){
            $ctrl.toggleIndex += 1;
        } else if(direction == 'right') {
            $ctrl.toggleIndex -= 1;
        }

        if($ctrl.toggleIndex >= 3) {
            $ctrl.toggleIndex = 0;
        } else if ($ctrl.toggleIndex <= -1) {
            $ctrl.toggleIndex = 2;
        }

        updateColumnActive();
    }
    
    function onCompareToggle() {
        if($ctrl.toggleIndex == 2){
            $ctrl.toggleIndex = 0;
        } else {
            $ctrl.toggleIndex += 1;
        }
        updateColumnActive();
    }

    function updateColumnActive() {
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


