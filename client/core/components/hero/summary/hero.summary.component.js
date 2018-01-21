'use strict';

import angular from 'angular';
import './hero.summary.css';
import numeral from 'numeral';

export default angular.module('hero.summary' ,[])
    .component('heroSummary', {
        template : require('./hero.summary.html'),
        controller : heroSummaryCtrl,
        bindings : {
            currentPlayer : "<",
            currentPlayerDatas : "<"
        },
    })
    .filter('nanFilter', function() {
        return function(input, defaultValue) {
            if(isNaN(input)) return defaultValue;
            else return input;
        }
    })
    .name;

export function heroSummaryCtrl($location, $element, $timeout, $rootScope, $stateParams, Analyzer, AppLogger, CoreUtils, LABEL_SUMMARY_PAGE){
    /* @ngInject */

    'ngInject';
    const env = process.env.NODE_ENV;
    const logFlag = false;
    var $ctrl = this;
    $ctrl.id = $stateParams.id;

    $ctrl.$onInit = function(){
        /* Init */
        initOnButton();

        /* Label Binding */
        $ctrl.label = LABEL_SUMMARY_PAGE;

        /* Summary Data(Resolve Data Binding) */
        $ctrl.cache = {};
        const crawlDatas = $ctrl.currentPlayerDatas;
        $ctrl.cache.profile = Analyzer.getSummaryProfile(crawlDatas);
        $ctrl.cache.most3 = Analyzer.getSummaryMost3(crawlDatas);
        $ctrl.cache.trend = Analyzer.getSummaryTrend(crawlDatas);

        const flag = false;
        if(flag && env != 'production') {
            console.log(crawlDatas);
            console.log($ctrl.cache.profile);
            console.log($ctrl.cache.most3);
            console.log($ctrl.cache.trend);
            AppLogger.log("== This is $ctrl.label ==", logFlag, 'info');
            AppLogger.log($ctrl.label, logFlag, 'info');
            AppLogger.log("== This is $ctrl.summaryData.profile  ==", logFlag, 'info');
            AppLogger.log($ctrl.cache.profile, logFlag, 'info');
            AppLogger.log("== $ctrl.summaryData.most3 ==", logFlag, 'info');
            AppLogger.log($ctrl.cache.most3, logFlag, 'info');
            AppLogger.log("== $ctrl.summaryData.trend ==", logFlag, 'info');
            AppLogger.log($ctrl.cache.trend, logFlag, 'info');
        }
        
        $ctrl.dynCache = {};
    }   

    $ctrl.$onChanges = function(changesObj){
        
    } 

    $ctrl.onTrendBtn = onTrendBtn;

    function onTrendBtn($event) {

        if(selectedDate == "") return;

        let selectedDate = "";

        switch($event.currentTarget.id) {
            case 'trend-today-btn' :
                selectedDate = 'today';
                break;
            case 'trend-yesterday-btn' :
                selectedDate = 'yesterday';
                break;
            case 'trend-week-btn' :
                selectedDate = 'week';
                break;
        }
        
        /* View update */
        onTrendBtnUpdate($event)

        /* Data Bind */ 
        onTrendDataBind(selectedDate);
    }

    function onTrendBtnUpdate($event) {
        $element.find("section.trend .btn-group button").removeClass('active');
        $($event.currentTarget).addClass('active');
    }

    function onTrendDataBind(dateIndex) {
        /* diff cptpt in trend label and data bind */
        $ctrl.dynCache.diffCptptLabel = $ctrl.label.trend.diffCptpt[dateIndex];
        $ctrl.dynCache.diffCptpt = $ctrl.cache.trend.diffCptpt[dateIndex];
        
        /* winrate process bar in trend label and data bind */
        const currentWinRates = $ctrl.cache.trend.winRates['current'];
        $ctrl.dynCache.currentProcessBar = getProcessbarData(currentWinRates);
        
        const selectedWinRates = $ctrl.cache.trend.winRates[dateIndex];
        $ctrl.dynCache.selectedProcessBar = getProcessbarData(selectedWinRates);
        return;
    }

    function getProcessbarData(winRates) {
        let success = 0;
        let danger = 0;
        let warning = 0;

        const totalGames = isNaN(winRates.totalGames) ? 0 : winRates.totalGames;
        const winGames = isNaN(winRates.winGames) ? 0 : winRates.winGames;
        const drawGames = isNaN(winRates.drawGames) ? 0 : winRates.drawGames;
        const loseGames = isNaN(winRates.loseGames) ? 0 : winRates.loseGames;
        
        success = numeral(winGames/totalGames).format('0.000');
        danger = numeral(loseGames/totalGames).format('0.000');
        if(drawGames != 0) warning = 1 - success - danger;
        
        return {
            winRates : success * 100,
            success : success,
            danger : danger,
            warning : warning,
        }
    }

    function initOnButton(){
        /* Need time out because of dom loading... */
        $timeout(function(){
            let $targetDom = $element.find('#trend-yesterday-btn');
            $('#trend-yesterday-btn').click();
        })
    }
}

