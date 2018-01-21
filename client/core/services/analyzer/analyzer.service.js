'use strict';

import angular from 'angular';

const logger = require('../../utils/logger/logger');
const appLogger = new logger('analyzer');
const SummaryAnalyzerCtrl = require('./summary.analyzer.service.controller');
const DetailAnalyzerCtrl = require('./detail.analyzer.service.controller');

export default angular
    .module('core.analyzer', [])
    .factory('Analyzer', function($rootScope, heroIndexes, tierIndexes, statMap, STATMAP, Indexer){

        const summaryAnalyzerCtrl = new SummaryAnalyzerCtrl(heroIndexes, Indexer, null, STATMAP);

        const datePicker = Indexer;
        const detailAnalyzerCtrl = new DetailAnalyzerCtrl(heroIndexes, tierIndexes, statMap, datePicker);

        return {
            /* dataA - dataB */
            getLabels : function() {
                let result = {};
                for(var heroId in STATMAP){
                    result[heroId] = [];
                    let stats = STATMAP[heroId];
                    for(let stat of stats){
                        result[heroId].push(stat.label);
                    }
                }
                return result;
            },
            /* Detail Data */
            getDetailStatIndexes : detailAnalyzerCtrl.getStatIndexes,
            makeDetailHeroDiffGames : detailAnalyzerCtrl.getHeroDiffGames,
            makeDetailPlayerDataSet : detailAnalyzerCtrl.getPlayerDataSet,
            makeDetailTierDataSet : detailAnalyzerCtrl.getTierDataSet,

            /* Summary Data */
            getSummaryProfile : summaryAnalyzerCtrl.getProfile,
            getSummaryMost3 : summaryAnalyzerCtrl.getMost3,
            getSummaryTrend : summaryAnalyzerCtrl.getTrend,
        }
    }).name;

export function DiffHeroDatasAnalyzer(STATMAP, Indexer) {

    this.getResult = function(playerDatas, arrDateIdx, tierData) {

        // diffIndexes = ['season', week', 'yesterday', 'today']

        let result = {};

        for(let dateIdx of arrDateIdx){
            if(dateIdx == 'season') {
                let playerData = playerDatas.current.data;
                const analyzer = new DiffHeroDatasAnalyzerForSeason(STATMAP);
                result[dateIdx] = analyzer.getResult(playerData, tierData);
            } else {
                let dates = Indexer.getIndexes(dateIdx);
            
                let playerDataA = playerDatas[dates.A].data;
                let playerDataB = playerDatas[dates.B].data;

                /* Get Diff Data*/
                let analyzer = new DiffHeroDatasAnalyzerForDate(STATMAP);
                result[dateIdx] = analyzer.getResult(playerDataA, playerDataB, tierData);
            }
        }
        return result;
    }

}

function DiffHeroDatasAnalyzerForSeason(STATMAP) {
    this.statMap = STATMAP;

    this.getResult = function(heroDataA, tierData) {
        let result = {};
        
        for(var heroId in STATMAP){
            if(heroDataA[heroId] == undefined) continue;

            result[heroId] = {};
            
            result[heroId] = [];
            for(let stat of STATMAP[heroId]){

                let statId = stat.label;
                let unit = stat.unit;
                let denominatorIndex = stat.denominator;
                let numeratorIndex = stat.numerator;
                
                
                let denominator = heroDataA[heroId][denominatorIndex];
                let numerator = heroDataA[heroId][numeratorIndex];
    
                /* score */
                //TODO: handling if denominator is 0
                //TODO: numerator has %timestamp code...
                let score = "-";
                if(denominator == 0 || isNaN(numerator) || isNaN(denominator)) score = "-";
                else score = numerator / denominator;
                
                let point = normalizeScore(score, tierData, heroId, statId);
                if(point < 0) point = 0;

                /* make result object */
                result[heroId].push({title : statId, score : score, point : point});
            }
        }
        return result;
    }
}

function DiffHeroDatasAnalyzerForDate(STATMAP){
    
    this.statMap = STATMAP;

    this.getResult = function(heroDataA, heroDataB, tierData) {

        let result = {};

        for(var heroId in STATMAP){

            // if(heroId.indexOf('_') != -1) continue;

            //FIXME: Undefined Handling, heroDataB can be null but A is not( A-B)
            
            if(heroDataA[heroId] == undefined || heroDataB[heroId] == undefined) continue;

            result[heroId] = {};
            
            // /* Common Stat (c.g. playgames) */
            // //FIXME: indexer must be separated
            // result[heroId].games = {};
            // for(let obj of STATMAP._games){
            //     let tempResult = heroDataA[heroId][obj.key] - heroDataB[heroId][obj.key];
            //     result[heroId].games[obj.id] = result;
            // }

            /* Speacil Stat depend on statmap */
            result[heroId] = [];
            for(let stat of STATMAP[heroId]){

                let statId = stat.label;
                let unit = stat.unit;
                let denominatorIndex = stat.denominator;
                let numeratorIndex = stat.numerator;
                
                let denominator = heroDataA[heroId][denominatorIndex] - heroDataB[heroId][denominatorIndex];
                let numerator = heroDataA[heroId][numeratorIndex] - heroDataB[heroId][numeratorIndex];
    
                /* score */
                //TODO: handling if denominator is 0
                //TODO: numerator has %timestamp code...
                let score = "-";
                if(denominator == 0 || isNaN(numerator) || isNaN(denominator)) score = "-";
                else score = numerator / denominator;

                let point = normalizeScore(score, tierData, heroId, statId);
                if(point < 0) point = 0;
                
                /* make result object */
                result[heroId].push({title : statId, score : score, point : point});
            }
        }
        return result;
    }
}

function normalizeScore(score, tierData, heroId, statId){
    
    let result = '-';
    if(score == '-') return result;
    
    const min = getValueFromTierData(tierData, heroId, statId, 'min');
    const max = getValueFromTierData(tierData, heroId, statId, 'max');
    
    if(!isNaN(score) || !isNaN(min) || !isNaN(max)) {
        result = normalize(score, min, max);
    } else {
        result = 'normalization_err';
    }

    return result;
}

function normalize(value, min, max) {
    return (value - min) / (max - min);
}

function getValueFromTierData(tierData, heroId, statId, valueName) {
    try {
        return tierData[heroId].total[statId][valueName];
    } catch (error) {
        appLogger.log(`can not get value from tier data ${heroId} ${statId}`, false, 'info');
        return;
    }
}

/* {date : {...}, meta : {...}, data : {...}*/
function getHeroDataFromPlayerDatas(playerDatas, index, hero) {
    try {
        return playerDatas[index].data[hero];
    } catch (error) {
        return undefined;
    }
}

function getMetaDataFromPlayerDatas(playerDatas, index) {
    try {
        return playerDatas[index].meta;
    } catch (error) {
        return undefined;
    }
}

function getCptptFromMetaData(metaData) {
    try {
        return parseInt(metaData.cptpt);
    } catch (error) {
        return undefined;
    }
}

function getDiffCptpt(metaDataA, metaDataB){
    const before = getCptptFromMetaData(metaDataB);
    const after = getCptptFromMetaData(metaDataA);
    const diffCptpt = after - before;

    let result = {
        before : before,
        after : after,
        diffCptpt : diffCptpt, 
    }
    return result;
}
