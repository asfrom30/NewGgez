'use strict';
require('./hero.detail.css');
import angular from 'angular';

export default angular
    .module('hero.detail', [])
    .component('heroDetail', {
        controller : HeroDetailCtrl,
        template : require('./hero.detail.html'),
        bindings : {
            currentPlayer : '<',
            currentPlayerDatas : '<',
            tierData : '<',
        }
    }).name;

export function HeroDetailCtrl(AppLogger, Ajax, CONFIG, $scope, $stateParams, Analyzer, Indexer, CoreUtils, tierMap){

    /* constants */
    const $ctrl = this;
    $ctrl.logScope = 'hero.detail';

    $ctrl.$onInit = function(){
        onInitAnalyzer();
        updateP1GamesLabel();
        updateP2GamesLabel();
    }

    /* Binding Method */
    $ctrl.onSelectorChanges = onSelectorChanges;
    $ctrl.changeP2PlayerData = changeP2PlayerData;

    function onInitAnalyzer(){
        /* Label Data */
        const labelData = makeAnalyzedLabelData();
        setLabelData2Cache(labelData);

        /* Tier Data */
        const tierData = $ctrl.tierData;
        const analyzedTierData = makeAnalyzedTierData(tierData);
        setAnalyzedTierData2Cache(analyzedTierData);

        /* Player Data */
        /* p1 player data */
        const p1PlayerData = $ctrl.currentPlayerDatas;
        const analyzedP1PlayerData = makeAnalyzedPlayerData(p1PlayerData, getAnalyzedTierDataFromCache());
        setAnalyzedP1PlayerData2Cache(analyzedP1PlayerData);
        /* p2 player data */
        const p2PlayerData = $ctrl.currentPlayerDatas;
        const analyzedP2PlayerData = makeAnalyzedPlayerData(p2PlayerData, getAnalyzedTierDataFromCache());
        setAnalyzedP2PlayerData2Cache(analyzedP2PlayerData);
    }

    function onSelectorChanges(selector) {
        // For display
        $ctrl.selector = selector;

        // mapping
        let p1Selected = selector.p1Index;
        let p2Selected = selector.p2Index;
        let tierSelected = selector.tierIndex;
        let heroSelected = selector.heroIndex;

        /* Update Data in Fixed Bottom*/
        updateHeroGamesLabel(p1Selected, p2Selected);

        if(heroSelected == undefined) {
            console.error('hero index is not selected');
            return;
        }
        
        updateTierGamesLabel(heroSelected);

        /* Update radar and table dataset*/
        updateRadarDataset(p1Selected, p2Selected, tierSelected, heroSelected);
        updateTableDataSet(p1Selected, p2Selected, tierSelected, heroSelected);
    }

    function changeP2PlayerData(id) {
        const region = 'kr';
        const device = 'pc';
        const dates = [CoreUtils.getTodayIndex()
            , CoreUtils.getCurrentIndex()
            , CoreUtils.getYesterIndex()
            , CoreUtils.getWeekIndex()
        ];

        Ajax.fetchCrawlDatas(device, region, id, dates).then(crawlDatas => {
            const playerData = transfer(crawlDatas);
            console.log(playerData);
            const analyzedPlayerData = makeAnalyzedPlayerData(playerData, getAnalyzedTierDataFromCache());
            //FIXME: need to store raw data.
            setAnalyzedP2PlayerData2Cache(analyzedPlayerData);

            updateP2GamesLabel();
            $scope.$apply();
        })
    }

    //FIXME: same code in hero main component : transfer crawl to player data. must be separte
    function transfer(crawlDatas) {
        
        let playerData = {};

        for(let crawlData of crawlDatas){
            playerData[crawlData.date] = {};
            playerData[crawlData.date].meta = crawlData.meta;
            playerData[crawlData.date].data = crawlData.data;
        }

        return playerData;
    } 

    /* Label Data */
    function makeAnalyzedLabelData() {
        return Analyzer.getLabels();
    }

    function setLabelData2Cache(labelData) {
        if($ctrl.cache == undefined) $ctrl.cache = {};
        $ctrl.cache.labels = labelData
    }

    function getLabelData() {
        try {
            return $ctrl.cache.labels;
        } catch (error) {
            console.warn('$ctrl.cache or $ctrl.cache.labels undefined, can not get label data');
            return undefined;
        }
        
    }

    /* Tier Data */
    function makeAnalyzedTierData(tierData) {
        return Analyzer.getTierData(tierData);
    }

    function setAnalyzedTierData2Cache(analyzedTierData) {
        if($ctrl.cache == undefined) $ctrl.cache = {};
        $ctrl.cache.tier = analyzedTierData;
    }

    function getAnalyzedTierDataFromCache() {
        try {
            return $ctrl.cache.tier;
        } catch (error) {
            console.warn('$ctrl.cache or $ctrl.cache.tier undefined, can not get tier data');
            return undefined;
        }
    }

    /* Player Data */
    function makeAnalyzedPlayerData(playerData, analyzedTierData) {
        const arrDateIdx = ['week', 'yesterday', 'today', 'season'];  // Dependecy is analyzed tier data

        return {
            diffGames : Analyzer.getDiffGames(playerData, arrDateIdx),
            diffDatas : Analyzer.getDiffHeroDatas(playerData, arrDateIdx, analyzedTierData)
        }
    }
    
    function setAnalyzedP1PlayerData2Cache(analyzedPlayerData) {
        if($ctrl.cache == undefined) $ctrl.cache = {};
        $ctrl.cache.p1 = analyzedPlayerData;
    }

    function setAnalyzedP2PlayerData2Cache(analyzedPlayerData) {
        if($ctrl.cache == undefined) $ctrl.cache = {};
        $ctrl.cache.p2 = analyzedPlayerData;
    }

    


    function updateRadarDataset(p1Index, p2Index, tierIndex, heroIndex) {
        
        /* heroIndex is basic index */
        if(heroIndex == undefined) return;
        
        $ctrl.radar = {};
        $ctrl.radar.labelColumn = $ctrl.cache.labels[heroIndex];

        let firstColumn = [];
        let secondColumn = [];
        let thirdColumn = [];

        try {
            $ctrl.radar.firstColumn = $ctrl.cache.p1.diffDatas[p1Index][heroIndex];
        } catch (error) {
            $ctrl.radar.firstColumn = [];
            console.log('can not read p1 ' + heroIndex + 'data');
        }

        try {
            $ctrl.radar.secondColumn = $ctrl.cache.p2.diffDatas[p2Index][heroIndex];
        } catch (error) {
            $ctrl.radar.secondColumn = [];
            console.log(error);
        }

        try {
            $ctrl.radar.thirdColumn = $ctrl.cache.tier[tierIndex][heroIndex];
        } catch (error) {
            $ctrl.radar.thirdColumn = [];
            console.log(error)
        }
    }
    
    function updateTableDataSet(p1Index, p2Index, tierIndex, heroIndex){
        $ctrl.table = {};
        $ctrl.table.labelColumn = $ctrl.cache.labels[heroIndex];
        
        if(p1Index != undefined) $ctrl.table.firstColumn = $ctrl.cache.p1.diffDatas[p1Index][heroIndex];
        if(p2Index != undefined) $ctrl.table.secondColumn = $ctrl.cache.p2.diffDatas[p2Index][heroIndex];
        if(tierIndex != undefined) $ctrl.table.thirdColumn = $ctrl.cache.tier[tierIndex][heroIndex];
    }

    function updateP1GamesLabel() {
        const obj = {
            yesterday : getPlayerTotalGames('p1', 'yesterday'),
            today : getPlayerTotalGames('p1', 'today'),
            week : getPlayerTotalGames('p1', 'week'),
            season : getPlayerTotalGames('p1', 'season'),
        };

        $ctrl.p1GameLabel = obj;
    }

    function updateP2GamesLabel() {
        const obj = {
            yesterday : getPlayerTotalGames('p2', 'yesterday'),
            today : getPlayerTotalGames('p2', 'today'),
            week : getPlayerTotalGames('p2', 'week'),
            season : getPlayerTotalGames('p2', 'season'),
        };

        $ctrl.p2GameLabel = obj;
    }

    function updateTierGamesLabel(heroId) {
        let result = {};
        
        for(let tierId of tierMap){
            if(tierId == "total") continue;
            try {
                result[tierId] = $ctrl.tierData[heroId][tierId].count;
            } catch (error) {
                result[tierId] = '-';
            }   
        }

        $ctrl.tierGameLabel = result;
    }

    /* Data Binding */
    function updateHeroGamesLabel(p1Index, p2Index) {
        const p1Playgames = $ctrl.cache.p1.diffGames[p1Index];
        const p2Playgames = $ctrl.cache.p2.diffGames[p2Index];

        /* result binding */
        $ctrl.heroGameLabel = {};
        $ctrl.heroGameLabel.p1 = p1Playgames;
        $ctrl.heroGameLabel.p2 = p2Playgames;
    }

    function getPlayerTotalGames(player, dateIndex){
        try {
            return $ctrl.cache[player].diffGames[dateIndex].all.totalGames;
        } catch (error) {
            return '-';
        }
    }

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

    /* Not needed Yet */
    $ctrl.storeUserDatas = function(id, userDatas) {
        if(angular.equals(userDatas, {}) || userDatas === undefined) {
            //TODO : Insert Custom Log.. (Debug..)
            return;
        }
        $ctrl.userDatas[id] = userDatas;
    }

    $ctrl.checkUserDatas = function(id) {
        if($ctrl.userDatas === undefined) {
            //TODO : Insert Custom Log.. (Debug..)
            return false;
        }

        if($ctrl.userDatas[id] === undefined || angular.equals($ctrl.userDatas[id], {})) {
            return false;  
        } else {
            return true;
        }
    }

    $ctrl.preSelected = function() {
         $ctrl.selector = {
            p1Index : "week",
            p2Index : "week",
            tierIndex : "gold",
            heroIndex : "hanzo"
        }

        $ctrl.selectorChanged($ctrl.selector);
    }
}



