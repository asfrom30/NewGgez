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
            allPlayers : '<',
            allPlayerDatas : '<',
        }
    }).name;

export function HeroDetailCtrl(AppLogger, CONFIG, $scope, $stateParams, Analyzer, Indexer, CoreUtils){

    /* variable */
    // Get id directly from $stateParams
    var $ctrl = this;
    $ctrl.logScope = 'hero.detail';

    /* This code is for access `players` and `playerdatas` which need id */
    // $ctrl.stateParams = {};
    // $ctrl.stateParams.id = $stateParams.id;

    $ctrl.$onInit = function(){

        //TODO: Transfer data method (encapsulation)
        // transferData();

        /* Detail Cache Data */
        $ctrl.detail = {};
        $ctrl.detail.firstP = {};
        $ctrl.detail.firstP.diffGames = {};
        $ctrl.detail.firstP.diffDatas = {};

        $ctrl.detail.secondP = {};
        $ctrl.detail.secondP.diffGames = {};
        $ctrl.detail.secondP.diffDatas = {};

        /* Cache Data(Excute one time) */
        $ctrl.cache = {};
        $ctrl.cache.p1 = {};
        $ctrl.cache.p2 = {};
        $ctrl.cache.labels = Analyzer.getLabels();

        // let diffIndexes = ['current', week', 'yesterday', 'today'];
        /* p1 data */
        let arrDateIdx = ['week', 'yesterday', 'today'];
        $ctrl.cache.p1.diffDatas = Analyzer.getDiffHeroDatas($ctrl.currentPlayerDatas, arrDateIdx, $ctrl.tierData);
        $ctrl.cache.p1.diffGames = Analyzer.getDiffGames($ctrl.currentPlayerDatas, arrDateIdx);
        
        /* p2 data */
        $ctrl.cache.p2.diffDatas = Analyzer.getDiffHeroDatas($ctrl.currentPlayerDatas, arrDateIdx, $ctrl.tierData);
        $ctrl.cache.p2.diffGames = Analyzer.getDiffGames($ctrl.currentPlayerDatas, arrDateIdx);
        
        /* tier data */
        $ctrl.cache.tier = Analyzer.getTierData($ctrl.tierData);

        /* Debug */
        console.log('↓ this is resolved Data');
        console.log($ctrl.currentPlayer);
        console.log($ctrl.currentPlayerDatas);
        console.log($ctrl.tierData);
        console.log('↓ this is cache');
        console.log($ctrl.cache);
        // console.log($ctrl.currentPlayerDatas);
        // console.log($ctrl.tierData);
    }
    

    /* Binding Method */
    $ctrl.selectorChanged = function(selector) {
        // For display
        $ctrl.selector = selector;

        // mapping
        let p1Index = selector.p1Index;
        let p2Index = selector.p2Index;
        let tierIndex = selector.tierIndex;
        let heroIndex = selector.heroIndex;


        if(selector.heroIndex == undefined) {
            // notify 'choose hero'
            return;
        }

        /* Update radar and table dataset*/
        updateRadarDataset(p1Index, p2Index, tierIndex, heroIndex);
        updateTableDataSet(p1Index, p2Index, tierIndex, heroIndex);
        updatePlayGamesLabel(p1Index, p2Index, tierIndex, heroIndex);

        return;


        // /* And condition neede(one of column && hero select */
        // let isP1Selected = (selector.p1Index == undefined) ? false : true;
        // let isP2Selected = (selector.p2Index == undefined) ? false : true;;
        // let isTierSelected = (selector.tierIndex == undefined) ? false : true;;
        // let isHeroSelectoed = (selector.heroIndex == undefined) ? false : true;

        
        // if(!((isP1Selected | isP2Selected | isTierSelected) && isHeroSelectoed)) {
        //     return;
        // }

        
        // let p1Index = selector.p1Index;
        // let p2Index = selector.p2Index;
        // let tierIndex = selector.tierIndex;
        // let heroIndex = selector.heroIndex;

        // /* Update radar and table dataset*/
        // updateRadarDataset(p1Index, p2Index, tierIndex, heroIndex);
        // updateTableDataSet(p1Index, p2Index, tierIndex, heroIndex);
        // updatePlayGamesLabel(p1Index, p2Index, tierIndex, heroIndex);
    }

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
            console.log(error);
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
    
    function updatePlayGamesLabel(p1Index, p2Index, tierIndex, heroIndex) {
        $ctrl.playGames = {}

        $ctrl.p1TotalGames = {
            today : $ctrl.cache.p2.diffGames.today.all.totalGames,
            yesterday : $ctrl.cache.p2.diffGames.yesterday.all.totalGames,
            week : $ctrl.cache.p2.diffGames.week.all.totalGames,
        }

        $ctrl.p2PlayGames = {
            today : $ctrl.cache.p1.diffGames.today.all.totalGames,
            yesterday : $ctrl.cache.p1.diffGames.yesterday.all.totalGames,
            week : $ctrl.cache.p1.diffGames.week.all.totalGames,
        }



        $ctrl.playGames.p1 = $ctrl.cache.p1.diffGames[p1Index];
        $ctrl.playGames.p2 = $ctrl.cache.p2.diffGames[p2Index];

        /* tier hero play games */
        // FIXME: tier Ids Map needed
        let tierIds = ["total", "bronze", "silver", "gold" , "platinum", "master", "grandmaster", "heroic"];
        let result ={};
        for(let tierId of tierIds){
            //FIXME: Save cache first, and get
            // result[tierId] = $ctrl.cache.tier[tierId][heroId].totalGames;
            if(tierId == "total") continue;
            result[tierId] = $ctrl.tierData[heroIndex][tierId].count;
        }
        $ctrl.playGames.tier = result;
    }
}



