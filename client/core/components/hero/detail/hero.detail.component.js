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

export function HeroDetailCtrl($timeout, $filter, $location, $state, $element, AppLogger, Ajax, CONFIG, $scope, $stateParams, Analyzer, CoreUtils, tierIndexes){
    //$ctrl.cache.dataSets.label[]
    //$ctrl.cache.dataSets.p1[p1Index, heroIndex]
    //$ctrl.cache.dataSets.p2[p2Index, heroIndex]
    //$ctrl.cache.dataSets.tier[tierIndex, heroIndex];
    //$ctlr.cahce.dataSets.statIndexes[denominatorIndex, heroIndex]

    /* constants */
    const $ctrl = this;
    const region = $stateParams.region;
    const device = $stateParams.device;
    const stateParams = {device : $stateParams.device, region : $stateParams.region, id : $stateParams.id};
    const dom = {
        loadingScreen : '.loading-screen',
        perDenominator : '#per_death'
    }

    const logFlag = false;

    $ctrl.$onInit = onInit;
    $ctrl.onSelectorChanges = onSelectorChanges;
    $ctrl.changeP2PlayerData = changeP2PlayerData;
    /* Button */
    $ctrl.onPerButton = onPerButton;
    $ctrl.onChangeTableResultUnit = onChangeTableResultUnit;
    $ctrl.onChangeTableColumnSelected = onChangeTableColumnSelected;

    $ctrl.onCompareToggle = onCompareToggle;
    $ctrl.onResultToggle = onResultToggle;
   
    function activeOne($_dom) {
        $_dom.parent().children().removeClass('active');
        $_dom.addClass('active');
    }

    function onInit() {
        $ctrl.mode = getMode();
        const mode = $ctrl.mode;

        initLabel('kr'); // en, cn
        $ctrl.cache = $ctrl.cache || {};
        $ctrl.cache.statIndexes = Analyzer.getDetailStatIndexes();
        

        // updateLabelData();//FIXME: Analyzer.getLabels(lang);
        
        // Using Analyzer get Data, Stored in cache // getAnalyzer Store in Cache.
        $ctrl.cache['p1'] = makePlayerDataSet($ctrl.currentPlayerDatas, $ctrl.tierData);
        if(mode == 'detail') $ctrl.cache['p2'] = makePlayerDataSet($ctrl.currentPlayerDatas, $ctrl.tierData);

        makeTierDataSet(); // getTierDataSetFromAnalyzer

        // need just once, not needed change when selectors changed
        updateP1GamesLabel();
        updateP2GamesLabel();

        initButtonClick();

        // log for debug
        logForDebug(logFlag);
    }

    function initButtonClick() {
        const mode =$ctrl.mode;

        const heroIndex = getP1MostHeroIndex();
        const tierIndex = getCurrentPlayerTierIndex();

        $timeout(function(){
            if(mode == 'detail') {
                $element.find(`#p0-week-selected`).click();
            } else if (mode == 'compare') {
                $element.find(`#p1-season-selected`).click();
                $element.find(`#p2-season-selected`).click();
            }
            if(tierIndex != undefined) $element.find(`#${tierIndex}`).click();
            if(heroIndex != undefined) $element.find(`#${heroIndex}`).click();
        }, 100)
    }

    function getP1MostHeroIndex(){
        const diffGames = getP1DiffGames('season');
        
        if(diffGames ==undefined) return;

        let tempGames = 0;
        let tempHeroIndex;

        for(const heroIndex in diffGames) {
            const diffGame = diffGames[heroIndex];
            if(heroIndex == 'all') continue;
            if(diffGame.totalGames > tempGames) {
                tempGames = diffGame.totalGames;
                tempHeroIndex = heroIndex;
            }
        }
        return tempHeroIndex;
    }


    function logForDebug(){
        if(!logFlag) return;

        console.log("======== for debug =====");
        console.log($ctrl.currentPlayerDatas)
        // console.log($ctrl.cache.statIndexes);
        console.log($ctrl.cache.p1);
        console.log($ctrl.cache.p2);
        // console.log($ctrl.cache.tier);
    }

    function onDenominatorChanges() {
        const selector = getCurrentSelector();
        
        if(selector == undefined) return;
        onSelectorChanges(selector);
    }

    function onSelectorChanges(selector) {
        $ctrl.bind = $ctrl.bind || {};
        const heroIndex = selector.heroIndex;
        const p1Index = selector.p1Index;
        const p2Index = selector.p2Index;
        const tierIndex = selector.tierIndex;
        const denominatorIndex = getDenominatorIndex();

        if(!heroIndex) {
            $element.find(dom.loadingScreen).hide();
            return;
        } else if(!(p1Index || p2Index || tierIndex)) {
            $element.find(dom.loadingScreen).hide();
            return;
        }

        // update game label in selectors
        updateHeroGameLabelP1(p1Index);
        updateHeroGameLabelP2(p2Index);
        updateTierGamesLabel(heroIndex);

        // update table and radar dataset
        $ctrl.bind.tableHeader = getTableHeader(denominatorIndex, p1Index, p2Index, tierIndex);
        $ctrl.bind.statIndexes = $ctrl.cache.statIndexes[denominatorIndex][heroIndex];
        $ctrl.bind.p1Stats = getSelectedPlayerStats(denominatorIndex, 'p1', p1Index, heroIndex);
        $ctrl.bind.p2Stats = getSelectedPlayerStats(denominatorIndex, 'p2', p2Index, heroIndex);
        $ctrl.bind.tierStats = getSelectedTierStats(denominatorIndex, tierIndex, heroIndex);

        setCurrentSelector(selector);
    }

    function changeP2PlayerData(id) {
        const region = $stateParams.region;
        const device = $stateParams.device;

        //FIXME: not yet implement : need to store raw data.
        Ajax.fetchCrawlDatas(device, region, id).then(crawlDatas => {
            $ctrl.cache.p2 = makePlayerDataSet(crawlDatas, $ctrl.tierData);
            console.log(crawlDatas);
            console.log($ctrl.cache.p2.diffGames.season.all);
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
    function initLabel(lang) {
        // static label
        $ctrl.label = {};
        $ctrl.label.please_select_data = '데이터를 선택해주세요';

        // dynamic label
    }

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

    /* Player Data */
    function makePlayerDataSet(crawlDatas, tierData) {
        const dateIndexes = ['week', 'yesterday', 'today', 'season'];  // Dependecy is analyzed tier data
        if($ctrl.cache == undefined) $ctrl.cache = {};
        
        return {
            diffGames : Analyzer.makeDetailHeroDiffGames(crawlDatas, dateIndexes),
            diffDatas : Analyzer.makeDetailPlayerDataSet(crawlDatas, dateIndexes, tierData)
        }
    }

    /* Tier Data */
    function makeTierDataSet() {
        const tierData = $ctrl.tierData;

        if($ctrl.cache == undefined) $ctrl.cache = {};
        $ctrl.cache.tier =  Analyzer.makeDetailTierDataSet(tierData);
    }

    function updateRadarDataset() {
        const p1Index = getP1Index();
        const p2Index = getP2Index();
        const tierIndex = getTierIndex();
        const heroIndex = getHeroIndex();
        
        /* heroIndex is basic index */
        if(heroIndex == undefined) return;
        
        $ctrl.radar = {};
        $ctrl.radar.labelColumn = $ctrl.cache.labels[heroIndex];

        if(heroIndex == undefined || heroIndex == 'all') return;
        
        if(p1Index == undefined || !hasP1Game(p1Index, heroIndex)) $ctrl.radar.firstColumn = [];
        else $ctrl.radar.firstColumn = getP1DiffDatasFromCache(p1Index, heroIndex);

        if(p2Index == undefined || !hasP2Game(p2Index, heroIndex)) $ctrl.radar.secondColumn = [];
        else $ctrl.radar.secondColumn = getP2DiffDatasFromCache(p2Index, heroIndex);

        if(tierIndex == undefined) $ctrl.radar.thirdColumn = [];
    }

    /* View */
    function onPerButton($event, denominatorIndex){
        // update view
        const $_dom = $element.find($event.target)
        activeOne($_dom);

        // update selector changes...
        onDenominatorChanges();
    }

    function onChangeTableResultUnit($event, unit) {
        // update view
        const $_dom = $element.find($event.target)
        activeOne($_dom);

        $scope.$broadcast("onChangeTableResultUnit", {unit : unit});
    }

    function onChangeTableColumnSelected($event, direction) {
        $scope.$broadcast("onChangeTableColumnSelected", {direction: direction});
    }
    
    function onCompareToggle(){
        $scope.$broadcast("onCompareToggle"); 
    }

    function onResultToggle(){
        $scope.$broadcast("onResultToggle"); 
    }


    /* Getter and setter */

    function getMode(){
        const path = $location.path();
        const index = path.lastIndexOf('/');
        const mode = path.substring(index + 1).trim();
        return mode;
    }

    function getCurrentPlayerTierIndex() {
        const cptpt = getCurrentPlayerCptpt();
        if(cptpt == undefined) return;
        
        return $filter('tierIndexFilter')(cptpt);
    }
    function getCurrentPlayerCptpt(){
        const player = $ctrl.currentPlayer;
        try {
            const cptpt = player.cptpt;
            return cptpt;
        } catch (error) {
            return undefined;
        }
    }
    function getSelectedPlayerStats(denominatorIndex, player, pIndex, heroIndex) {
        try {
            return $ctrl.cache[player]['diffDatas'][denominatorIndex][pIndex][heroIndex];
        } catch (error) {
            console.error(`denominatorIndex : ${denominatorIndex}, player index : ${player}, heroIndex : ${heroIndex} can not get selected player stat from cache`)
            return undefined;
        }
    }
    function getSelectedTierStats(denominatorIndex, tierIndex, heroIndex) {
        try {
            if(tierIndex == undefined) return;
            if(heroIndex == undefined) return;
            if(denominatorIndex == undefined) return;
            return $ctrl.cache.tier[denominatorIndex][tierIndex][heroIndex];
        } catch (error) {
            console.error(`denominatorIndex : ${denominatorIndex}, tier index : ${tierIndex}, heroIndex : ${heroIndex} can not get selected tier stats from cache`)
            return undefined;
        }
    }

    function getP1DiffDatasFromCache(p1Index, heroIndex) {
        try {
            return $ctrl.cache.p1.diffDatas[p1Index][heroIndex];
        } catch (error) {
            console.error(`p1 index : ${p1Index}, p2Index : ${heroIndex} can not get p1 table datas from cache`)
            return;
        }
    }

    function getP2DiffDatasFromCache(p2Index, heroIndex) {
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

    function updateTierGamesLabel(heroIndex) {
        let result = {};
        for(let tierIndex of tierIndexes){
            try {
                result[tierIndex] = $ctrl.tierData[heroIndex][tierIndex].count;
            } catch (error) {
                result[tierIndex] = '-';
            }   
        }
        $ctrl.tierGameLabel = result;
    }

    function updateHeroGameLabelP1(p1Index) {
        if(p1Index != undefined) {
            const diffGames = getP1DiffGames(p1Index);
            setHeroGameLabelP1(diffGames);
        }
    }

    function updateHeroGameLabelP2(p2Index) {
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

    function getP1Index() {
        let result = 'not_yet_selected'
        try {
            if($ctrl.selector.p1Index != undefined) result = $ctrl.selector.p1Index;
        } catch (error) {
            AppLogger.log('p1 index is undefined', logFlag, 'warn');
        }
        return result;
    }

    function getP2Index() {
        let result = 'not_yet_selected'
        try {
            if($ctrl.selector.p2Index != undefined) result = $ctrl.selector.p2Index;
        } catch (error) {
            AppLogger.log('p2 index is undefined', logFlag, 'warn');
        }
        return result;
    }

    function getTierIndex() {
        let result = 'not_yet_selected'
        try {
            if($ctrl.selector.tierIndex != undefined) result = $ctrl.selector.tierIndex;
        } catch (error) {
            AppLogger.log('tier index is undefined', logFlag, 'warn');
        }
        return result;
    }

    function getHeroIndex() {
        try {
            return $ctrl.selector.heroIndex;
        } catch (error) {
            AppLogger.log('hero index is undefined', logFlag, 'warn');
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

    function hasP1Game(p1Index, heroIndex) {
        let game;

        try {
            game = $ctrl.cache.p1.diffGames[p1Index][heroIndex].totalGames;
        } catch (error) {
            game = undefined;
        }

        if(game == undefined || game == 0) return false;
        else return true;
    }

    function hasP2Game(p2Index, heroIndex) {
        let game;
        
        try {
            game = $ctrl.cache.p2.diffGames[p2Index][heroIndex].totalGames;
        } catch (error) {
            game = undefined;
        }

        if(game == undefined || game == 0) return false;
        else return true;
    }

    function setHeroGameLabelP1(p1HeroGameLabel) {
        if($ctrl.heroGameLabel == undefined) $ctrl.heroGameLabel = {};
        $ctrl.heroGameLabel.p1 = p1HeroGameLabel;
    }

    function setHeroGameLabelP2(p2HeroGameLabel) {
        if($ctrl.heroGameLabel == undefined) $ctrl.heroGameLabel = {};
        $ctrl.heroGameLabel.p2 = p2HeroGameLabel;
    }

    function getTableHeader(denominatorIndex, p1Index, p2Index, tierIndex) {
        return [
            {index : denominatorIndex}, 
            {index : p1Index}, 
            {index : p2Index}, 
            {index : tierIndex}];
    }

    function getActiveDomIdInSiblings(domSelector){
        let activeId;
        $element.find(domSelector).parent().children().each(function(){
            if($(this).hasClass('active')) {
                activeId = $(this).attr('id');
            } 
        })
        return activeId;
    }

    function getDenominatorIndex() {
        const domId = getActiveDomIdInSiblings(dom.perDenominator);
        if(domId == 'per_game') {
            return "game";
        } else {
            return "death"
        }
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



