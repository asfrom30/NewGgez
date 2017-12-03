'use strict';

import angular from 'angular';
import './hero.summary.css';

export default angular.module('hero.summary' ,[])
    .component('heroSummary', {
        template : require('./hero.summary.html'),
        controller : heroSummaryCtrl,
        bindings : {
            currentPlayer : "<",
            currentPlayerDatas : "<"
        },
    })
    .name;

export function heroSummaryCtrl($element, $timeout, $rootScope, $stateParams, Analyzer, Indexer, CoreUtils, LABEL_SUMMARY_PAGE){
    /* @ngInject */

    'ngInject';
    
    var $ctrl = this;
    $ctrl.id = $stateParams.id;

    $ctrl.$onInit = function(){
        /* Init */
        initOnButton();

        /* Label Binding */
        $ctrl.label = LABEL_SUMMARY_PAGE;

        /* Summary Data(Resolve Data Binding) */
        /* Profile Data Binding */
        $ctrl.summaryData = {};
        $ctrl.summaryData.profile = Analyzer.getSummaryProfile($ctrl.currentPlayerDatas);

        /* Most3 Data Binding */
        $ctrl.summaryData.most3 = Analyzer.getSummaryMost3($ctrl.currentPlayerDatas);
        // console.log($ctrl.summaryData.most3);

        /* Calculate Trend Data */
        $ctrl.cache = {};
        $ctrl.cache.summary = Analyzer.getSummaryTrend($ctrl.currentPlayerDatas);
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

    function onTrendDataBind(selectedDate) {
        /* Result Object Structure */
        let trendData = {
            winRates : {
                totalGames : 0,
                winGames : 0,
                drawGames : 0,
                loseGames : 0,
            },
            diffCptpt : {
                before : 0,
                after : 0,
                diffCptpt : 0
            }
        };

        /* Data Bind */
        trendData.winRates = $ctrl.cache.summary.winRates[selectedDate];
        trendData.diffCptpt = $ctrl.cache.summary.diffCptpt[selectedDate];

        $ctrl.summaryData.trend = trendData;
        return;
    }

    function initOnButton(){
        /* Need time out because of dom loading... */
        $timeout(function(){
            let $targetDom = $element.find('#trend-yesterday-btn');
            $('#trend-yesterday-btn').click();
        })
    }
}

