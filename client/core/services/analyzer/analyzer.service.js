'use strict';

import angular from 'angular';

export default angular
    .module('core.analyzer', [])
    .factory('Analyzer', function($rootScope, CONST_DIFF_GAMES_MAP, CONST_HERO_MAP, STATMAP, Indexer){
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
            getDiffGames : function(heroDataA, heroDataB) {
                let analyzer = new DiffGamesAnalyzer(Indexer, CONST_HERO_MAP, CONST_DIFF_GAMES_MAP);
                return analyzer.getResult(heroDataA, heroDataB);
            },
            getDiffHeroDatas : function(playerDatas, diffIndexes, tierData) {
                let analyzer = new DiffHeroDatasAnalyzer(STATMAP, Indexer);
                return analyzer.getResult(playerDatas, diffIndexes, tierData);
            },
            getTierData : function(tierDataPerDate) {
                let analyzer = new TierDataAnalyzer(CONST_HERO_MAP, STATMAP);
                return analyzer.getResult(tierDataPerDate);
            },
            /* Summary Data */
            getSummaryProfile : function(playerData) {
                let analyzer = new SummaryProfileAnalyzer(STATMAP);
                return analyzer.getResult(playerData);
            },
            getSummaryMost3 : function(playerData) {
                let analyzer = new SummaryMost3Analyzer(STATMAP);
                return analyzer.getResult(playerData);
            },
            getSummaryTrend  : function(playerDatas) {
                let analyzer = new SummaryTrendAnalyzer(Indexer);
                return analyzer.getResult(playerDatas);
            }
        }
    }).name;

export function DiffGamesAnalyzer(Indexer, heroMap, diffGamesMap) {

    let result = {};

    this.heroMap = heroMap;

    this.getResult = function(playerDatas, diffIndexes) {

        let result = {};

        for(let diffIndex of diffIndexes){
            
            result[diffIndex] = {};
    
            let indexes = Indexer.getIndexes(diffIndex);

            let heroDatasA = playerDatas[indexes.A].data;
            let heroDatasB = playerDatas[indexes.B].data;

            for(let heroId of heroMap) {
                if(heroDatasA[heroId] == undefined || heroDatasB[heroId] == undefined) continue;
                result[diffIndex][heroId] = getWinRates(heroDatasA[heroId], heroDatasB[heroId]);
            }
        }
    
        return result;

    }
}
export function DiffHeroDatasAnalyzer(STATMAP, Indexer) {

    this.getResult = function(playerDatas, arrDateIdx, tierData) {

        // diffIndexes = ['week', 'yesterday', 'today']

        let result = {};

        for(let dateIdx of arrDateIdx){
            result[dateIdx] = {};

            let dates = Indexer.getIndexes(dateIdx);
        
            let playerDataA = playerDatas[dates.A].data;
            let playerDataB = playerDatas[dates.B].data;

            /* Get Diff Data*/
            let diffDatasAnalyzer = new DiffDataAnalyzer(STATMAP);
            result[dateIdx] = diffDatasAnalyzer.getResult(playerDataA, playerDataB, tierData);
        }

        return result;
    }

}

function DiffDataAnalyzer(STATMAP){
    
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

                
                /* point */
                let normalization = '-';
                if(tierData[heroId] != undefined) {
                    if(tierData[heroId].total[statId] != undefined) {
                        let minValue = tierData[heroId].total[statId].min;
                        let maxValue = tierData[heroId].total[statId].max;
                        normalization = (score - minValue) / (maxValue - minValue);
                    }
                }

                /* make result object */
                result[heroId].push({title : statId, score : score, point : normalization});

                /* Debug */
                // if(heroId == "ana"){
                //     console.log("hero : " + heroId + ", statId : " + statId + ", denominator : " + denominatorIndex + ", numerator : " + numeratorIndex);
                //     console.log(heroDataA.ana);
                //     console.log("score[" + score + "], numerator [" + numerator +  "], denominator [" +  denominator + "]")
                // }
            }
        }
        return result;
    }
}

export function TierDataAnalyzer(heroMap, statMap) {
    this.getResult = function(tierDataPerDate) {
        
        let tierMap = ["bronze", "silver", "gold", "platinum", "master", "grandmaster", "heroic", "total"];
        
        let result = {};

        for(let tierId of tierMap) {
            result[tierId] = {};
            for(let heroId of heroMap) {
                result[tierId][heroId] = [];

                for(let statObj of statMap[heroId]) {
                    let statId = statObj.label;
                    if(tierDataPerDate[heroId] == undefined || tierDataPerDate[heroId][tierId] == undefined || tierDataPerDate[heroId][tierId][statId] == undefined) {
                        result[tierId][heroId].push({title : statId, score : null, point : null});
                        continue;
                    }
                    let score = tierDataPerDate[heroId][tierId][statId].avg;
                    let minValue = tierDataPerDate[heroId][tierId][statId].min;
                    let maxValue = tierDataPerDate[heroId][tierId][statId].max;
                    let normalization = (score - minValue) / (maxValue - minValue);

                    result[tierId][heroId].push({title : statId, score : score, point : normalization});
                }
            }
        }
        return result;
    }
}

export function SummaryProfileAnalyzer(statMap) {
    this.statMap = statMap;
    this.getResult = function(playerData){
        return {
            cptpt : playerData.current.meta.cptpt,
            totalGame : playerData.current.data.all.치른게임,
            winGame : playerData.current.data.all.승리한게임,
            loseGame : playerData.current.data.all.패배한게임,
        }
    }
}

export function SummaryMost3Analyzer(diffGamesMap, statMap) {
    this.diffGameMap = diffGamesMap;
    this.statMap = statMap;

    this.getResult = function(playerData){

        let heroDatas = playerData.current.data;

        /* Build Playtimes */
        let playtimes = [];
        for(let heroKey in heroDatas) {
            if(heroKey == 'all') continue;

            /* Calculate Current TS */
            let currentTs = heroDatas[heroKey].플레이시간;

            /* Calculate Win Rate */
            let winRates = getWinRates(heroDatas[heroKey]);

            /* Calculate Average Score */
            let avgScore = "-";

            /* Calcaulate KDA */ 
            let kda = heroDatas[heroKey].목숨당처치;

            /* Calculate Burning Time */
            let burningTime = heroDatas[heroKey].폭주시간;
            
            playtimes.push({
                key : heroKey, 
                avgScore : avgScore,
                burningTime : burningTime,
                kda : kda,
                winRate : winRates.winRate,
                totalGames : winRates.totalGames,
                winGames : winRates.winGames,
                drawGames : winRates.drawGames,
                loseGames : winRates.loseGames,
                value : currentTs
            });
        }
          
        /* Sort by Value */
        playtimes.sort(function (a, b) {
            return -(a.value - b.value);
        });

        return playtimes.slice(0,3);


        let most3 = [
            {hero : playtimes[0].key, winRate : 76, totalGame : 30, winGame : 20, loseGame : 10},
            {hero : playtimes[1].key, winRate : 76, totalGame : 30, winGame : 20, loseGame : 10},
            {hero : playtimes[2].key, winRate : 76, totalGame : 30, winGame : 20, loseGame : 10},
        ]
        return most3; 
    }
}

export function SummaryTrendAnalyzer(Indexer) {

    this.getResult = function(playerDatas){

        let result = {
            diffCptpt : {
                yesterday : {},
                today:{},
                week : {},
            },
            winRates : {
                yesterday : {},
                today:{},
                week : {},
            }
        }

        let dateIndexs = ['week', 'yesterday', 'today'];

        let heroData = playerDatas.current.data.all;
        result.winRates.current = getWinRates(heroData);

        for(let dateIndex of dateIndexs){
            let indexes = Indexer.getIndexes(dateIndex);

            let playerDataA = playerDatas[indexes.A];
            let playerDataB = playerDatas[indexes.B];

            let heroDataA = playerDataA.data.all;
            let heroDataB = playerDataB.data.all;

            result.winRates[dateIndex] = getDiffWinRates(heroDataA, heroDataB);
            result.diffCptpt[dateIndex] = getDiffCptpt(playerDataA, playerDataB);
        }

        
        return result;
    }
}

function getDiffCptpt(playerDataA, playerDataB){
    //FIXME: undefined handling.
    let result = {
        before : parseInt(playerDataA.meta.cptpt),
        after : parseInt(playerDataB.meta.cptpt),
        diffCptpt : parseInt(playerDataA.meta.cptpt) - parseInt(playerDataB.meta.cptpt)
    }
    return result;
}

/* Make function smaller, and build bigger using smaller */
function getDiffGames(heroDataA, heroDataB, heroMap, diffGamesMap) {
    let result = {};

    for(let heroId of heroMap) {
        
        if(heroDataA[heroId] == undefined || heroDataB[heroId] == undefined) continue;
        
        result[heroId] = {};

        for(let mapObj of diffGamesMap){
            result[heroId][mapObj.id] = heroDataA[heroId][mapObj.key] - heroDataB[heroId][mapObj.key];
        }
    }

    return result;
}

function getDiffWinRates (heroDataA, heroDataB) {
    let defaultResult = {
        winRate : "-",
        totalGames : "-",
        winGames : "-",
        drawGames : "-",
        loseGames : "-"
    };

    let totalGamesLabel = "치른게임";
    let winGamesLabel = "승리한게임";
    let drawGamesLabel = "무승부게임";
    let loseGamesLabel = "패배한게임";

    //FIXME: undeifined....
    try {
        let totalGames = heroDataA[totalGamesLabel] - heroDataB[totalGamesLabel];
        let winGames = heroDataA[winGamesLabel] - heroDataB[drawGamesLabel];
        let drawGames = heroDataA[drawGamesLabel] - heroDataB[drawGamesLabel];
        let loseGames = heroDataA[loseGamesLabel] - heroDataB[loseGamesLabel];
    
        let result = makeWinRatesObj(defaultResult, totalGames, winGames, drawGames, loseGames);
        return result;
    } catch (error) {
        return defaultResult;
    }
    
}

/* TODO: Need test Code*/
function getWinRates (heroData) {
    let defaultResult = {
        winRate : "-",
        totalGames : "-",
        winGames : "-",
        drawGames : "-",
        loseGames : "-"
    };

    // FIXME: use diff gamesmap
    // for(let mapObj of diffGamesMap){
    //     result[diffIndex][heroId][mapObj.id] = heroDataA[heroId][mapObj.key] - heroDataB[heroId][mapObj.key];
    // }

    let totalGamesLabel = "치른게임";
    let winGamesLabel = "승리한게임";
    let drawGamesLabel = "무승부게임";
    let loseGamesLabel = "패배한게임";

    let totalGames = parseInt(heroData[totalGamesLabel]);
    let winGames = parseInt(heroData[winGamesLabel]);
    let drawGames = parseInt(heroData[drawGamesLabel]);
    let loseGames = parseInt(heroData[loseGamesLabel]);

    let result = makeWinRatesObj(defaultResult, totalGames, winGames, drawGames, loseGames);
    return result;
}

function makeWinRatesObj (defaultResult, totalGames, winGames, drawGames, loseGames){
    if(isNaN(totalGames) || totalGames == 0){
        return defaultResult;
    } else {
        defaultResult.totalGames = totalGames;
    }

    if(!isNaN(totalGames)){defaultResult.totalGames = totalGames;}
    if(!isNaN(winGames)){defaultResult.winGames = winGames;}
    if(!isNaN(drawGames)){defaultResult.drawGames = drawGames;}
    if(!isNaN(loseGames)){defaultResult.loseGames = loseGames;}

    /* Calculate Win RAte*/
    if(Number.isInteger(defaultResult.totalGames)) {
        if(defaultResult.winGames == 0) defaultResult.winRate = 0;

        if(Number.isInteger(defaultResult.winGames)) {
            if(Number.isInteger(defaultResult.drawGames)) {
                defaultResult.winRate = defaultResult.winGames / (defaultResult.totalGames - defaultResult.drawGames)
            } else {
                defaultResult.winRate = defaultResult.winGames / defaultResult.totalGames
            }
        } else if (!Number.isInteger(defaultResult.winGames)) {
            defaultResult.winRate = 0;
        }
    }
    return defaultResult;
}