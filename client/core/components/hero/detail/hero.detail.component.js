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
        updateLabelData();
        updateTierData();

        updateP1PlayerData($ctrl.currentPlayerDatas);
        updateP1GamesLabel();

        updateP2PlayerData($ctrl.currentPlayerDatas);
        updateP2GamesLabel();
        
        /* Update Data in Fixed Bottom*/
        updateHeroGameLabelP1()
        updateHeroGameLabelP2();
        
    }

    /* Binding Method */
    $ctrl.onSelectorChanges = onSelectorChanges;
    $ctrl.changeP2PlayerData = changeP2PlayerData;

    function onSelectorChanges(selector) {
        setCurrentSelector(selector);

        updateHeroGameLabelP1();
        updateHeroGameLabelP2();

        if(getCurrentHeroIndex() != undefined) {
            updateTierGamesLabel();
            // updateRadarDataset();
            updateTableDataSet();
        }
    }

    function changeP2PlayerData(id) {
        const region = $stateParams.region;
        const device = $stateParams.device;

        //FIXME: not yet implement : need to store raw data.
        Ajax.fetchCrawlDatas(device, region, id).then(crawlDatas => {
            const playerData = transfer(crawlDatas);
            updateP2PlayerData(playerData);
            updateP2GamesLabel();
            updateHeroGameLabelP2();
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
    function updateLabelData() {
        const labelData = makeAnalyzedLabelData();
        setLabelData2Cache(labelData);
    }

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
    function updateTierData() {
        const tierData = $ctrl.tierData;
        const analyzedTierData = makeAnalyzedTierData(tierData);
        setAnalyzedTierData2Cache(analyzedTierData);
    }
    
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
    function updateP1PlayerData(playerData) {
        const analyzedP1PlayerData = makeAnalyzedPlayerData(playerData, getAnalyzedTierDataFromCache());
        setAnalyzedP1PlayerData2Cache(analyzedP1PlayerData);
    }
    
    function updateP2PlayerData(playerData) {
        const analyzedP2PlayerData = makeAnalyzedPlayerData(playerData, getAnalyzedTierDataFromCache());
        setAnalyzedP2PlayerData2Cache(analyzedP2PlayerData);
    }

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


    function updateRadarDataset() {
        const p1Index = getCurrentP1Index();
        const p2Index = getCurrentP2Index();
        const tierIndex = getCurrentTierIndex();
        const heroIndex = getCurrentHeroIndex();
        
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
            console.log('can not read p1 ' + heroIndex + ' data');
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
    
    function updateTableDataSet(){
        const p1Index = getCurrentP1Index();
        const p2Index = getCurrentP2Index();
        const tierIndex = getCurrentTierIndex();
        const heroIndex = getCurrentHeroIndex();

        setTableHeader();

        if(heroIndex == undefined || heroIndex == 'all') return;

        setTableColumn(0, getTableLabelColumn(heroIndex));
        if(p1Index != undefined) setTableColumn(1, getP1TableDatasFromCache(p1Index, heroIndex));
        if(p2Index != undefined) setTableColumn(2, getP2TableDatasFromCache(p2Index, heroIndex)); 
        if(tierIndex != undefined) setTableColumn(3, getTierTableDatasFromCache(tierIndex, heroIndex)); 
    }

    function getTierTableDatasFromCache(tierIndex, heroIndex) {
        try {
            return $ctrl.cache.tier[tierIndex][heroIndex];
        } catch (error) {
            console.error(`tier index : ${tierIndex}, heroIndex : ${heroIndex} can not get tier table datas from cache`)
            return;
        }
    }
    function getP1TableDatasFromCache(p1Index, heroIndex) {
        try {
            return $ctrl.cache.p1.diffDatas[p1Index][heroIndex];
        } catch (error) {
            console.error(`p1 index : ${p1Index}, p2Index : ${heroIndex} can not get p1 table datas from cache`)
            return;
        }
    }

    function getP2TableDatasFromCache(p2Index, heroIndex) {
        try {
            return $ctrl.cache.p2.diffDatas[p2Index][heroIndex];
        } catch (error) {
            console.error(`p1 index : ${p2Index}, p2Index : ${heroIndex} can not get p2 table datas from cache`)
            return;
        }
    }

    function setTableColumn(columnNum, columnDatas) {
        if($ctrl.table == undefined) $ctrl.table = {};

        switch (columnNum) {
            case 0: 
                $ctrl.table.labelColumn = columnDatas;
                break;
            case 1:
                $ctrl.table.firstColumn = columnDatas;
                break;
            case 2:
                $ctrl.table.secondColumn = columnDatas
                break;
            case 3:
                $ctrl.table.thirdColumn = columnDatas
                break;
            default:
                console.error('column num setting is not properly');
                break;
        }
    }

    function getTableLabelColumn(heroIndex) {
        try {
            return $ctrl.cache.labels[heroIndex];
        } catch (error) {
            console.error('can not get table label column, one of key is undefined');
            return undefined;
        }
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

    function updateTierGamesLabel() {
        let result = {};

        const heroIndex = getCurrentHeroIndex();
        
        for(let tierId of tierMap){
            if(tierId == "total") continue;
            try {
                result[tierId] = $ctrl.tierData[heroIndex][tierId].count;
            } catch (error) {
                result[tierId] = '-';
            }   
        }

        $ctrl.tierGameLabel = result;
    }

    function updateHeroGameLabelP1() {
        const p1Index = getCurrentP1Index();

        if(p1Index != undefined) {
            const diffGames = getP1DiffGames(p1Index);
            setHeroGameLabelP1(diffGames);
        }
    }

    function updateHeroGameLabelP2() {
        const p2Index = getCurrentP2Index();

        if(p2Index != undefined) {
            const diffGames = getP2DiffGames(p2Index);
            setHeroGameLabelP2(diffGames);
        }
    }

    function getPlayerTotalGames(player, dateIndex){
        try {
            return $ctrl.cache[player].diffGames[dateIndex].all.totalGames;
        } catch (error) {
            return '-';
        }
    }

    function setCurrentSelector(selector) {
        if(selector == undefined) {
            console.error('can not set current selector, selector is undefined');
            return;
        }

        $ctrl.selector = selector;
    }

    function getCurrentSelector() {
        return $ctrl.selector;
    }

    function getCurrentP1Index() {
        let result = 'not_yet_selected'
        try {
            if($ctrl.selector.p1Index != undefined) result = $ctrl.selector.p1Index;
        } catch (error) {
            console.error('can not get current p1Index');
        }
        return result;
    }

    function getCurrentP2Index() {
        let result = 'not_yet_selected'
        try {
            if($ctrl.selector.p2Index != undefined) result = $ctrl.selector.p2Index;
        } catch (error) {
            console.error('can not get current p2Index');
        }
        return result;
    }

    function getCurrentTierIndex() {
        let result = 'not_yet_selected'
        try {
            if($ctrl.selector.tierIndex != undefined) result = $ctrl.selector.tierIndex;
        } catch (error) {
            console.error('can not get current tierIndex');
        }
        return result;
    }

    function getCurrentHeroIndex() {
        try {
            return $ctrl.selector.heroIndex;
        } catch (error) {
            console.error('can not get current heroIndex');
            return undefined;
        }
    }

    function getP1DiffGames(p1Index) {
        try {
            return $ctrl.cache.p1.diffGames[p1Index];
        } catch (error) {
            console.error(`can not get p1 ${p1Index} diff games`);
            return undefined;
        }
    }

    function getP2DiffGames(p2Index) {
        try {
            return $ctrl.cache.p2.diffGames[p2Index];
        } catch (error) {
            console.error(`can not get p2 ${p2Index} diff games`);
            return undefined;
        }
    }

    function setHeroGameLabelP1(p1HeroGameLabel) {
        if($ctrl.heroGameLabel == undefined) $ctrl.heroGameLabel = {};
        $ctrl.heroGameLabel.p1 = p1HeroGameLabel;
    }

    function setHeroGameLabelP2(p2HeroGameLabel) {
        if($ctrl.heroGameLabel == undefined) $ctrl.heroGameLabel = {};
        $ctrl.heroGameLabel.p2 = p2HeroGameLabel;
    }

    function setTableHeader() {
        if($ctrl.table == undefined) $ctrl.table ={};
        $ctrl.table.header =[
            {index : ''}, 
            {index : getCurrentP1Index()}, 
            {index : getCurrentP2Index()}, 
            {index : getCurrentTierIndex()}, 
            {index : 'result'}];
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



