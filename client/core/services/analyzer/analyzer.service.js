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
            getDiffGames : function(playerDatas, diffIndexes) {
                let analyzer = new DiffGamesAnalyzer(Indexer, CONST_HERO_MAP, CONST_DIFF_GAMES_MAP);
                return analyzer.getResult(playerDatas, diffIndexes);
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
    
            const indexes = Indexer.getIndexes(diffIndex);

            const heroDatasA = playerDatas[indexes.A].data;
            const heroDatasB =  (indexes.B == undefined) ? undefined : playerDatas[indexes.B].data;

            for(let heroId of heroMap) {
                let winRates;

                if(heroDatasA[heroId] == undefined) {
                    continue;
                } else {
                    if(heroDatasB == undefined) winRates = getDiffWinRates(heroDatasA[heroId], undefined);
                    else winRates = getDiffWinRates(heroDatasA[heroId], heroDatasB[heroId]);
                    
                }
                result[diffIndex][heroId] = winRates;
            }
        }
    
        return result;

    }
}
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
                
                const point = normalizeScore(score, tierData, heroId, statId);

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

                const point = normalizeScore(score, tierData, heroId, statId);

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
        console.warn(`can not get value from tier data ${heroId} ${statId}`);
        return;
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

            /* Hero data is empty object */
            const heroData = heroDatas[heroKey];
            if(Object.keys(heroData).length === 0 && heroData.constructor === Object || heroData == undefined) continue;

            /* Calculate Current TS */
            let currentTs = heroDatas[heroKey].플레이시간;
            currentTs = convertToInteger(currentTs);

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

    if(heroDataA == undefined) return defaultResult;

    let totalGamesLabel = "치른게임";
    let winGamesLabel = "승리한게임";
    let drawGamesLabel = "무승부게임";
    let loseGamesLabel = "패배한게임";

    /* make default heroDataB : all of undefined value to be 0 */
    if(heroDataB == undefined) {
        heroDataB = {};
        heroDataB[totalGamesLabel] = 0;
        heroDataB[winGamesLabel] = 0;
        heroDataB[drawGamesLabel] = 0;
        heroDataB[loseGamesLabel] = 0;
    } else {
        if (heroDataB[totalGamesLabel] == undefined) heroDataB[totalGamesLabel] = 0;
        if (heroDataB[winGamesLabel] == undefined) heroDataB[winGamesLabel] = 0;
        if (heroDataB[drawGamesLabel] == undefined) heroDataB[drawGamesLabel] = 0;
        if (heroDataB[loseGamesLabel] == undefined) heroDataB[loseGamesLabel] = 0;
    }


    const totalGames = (heroDataA[totalGamesLabel] == undefined) ? '-' : heroDataA[totalGamesLabel] - heroDataB[totalGamesLabel];
    const winGames = (heroDataA[winGamesLabel] == undefined) ? '-' : heroDataA[winGamesLabel] - heroDataB[drawGamesLabel];
    const drawGames = (heroDataA[drawGamesLabel] == undefined) ? '-' : heroDataA[drawGamesLabel] - heroDataB[drawGamesLabel];
    const loseGames = (heroDataA[loseGamesLabel] == undefined) ? '-' : heroDataA[loseGamesLabel] - heroDataB[loseGamesLabel];
    

    const result = makeWinRatesObj(defaultResult, totalGames, winGames, drawGames, loseGames);
    return result;
    
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
    if(isNaN(totalGames)){
        return defaultResult;
    } else if (totalGames == 0) {
        defaultResult.totalGames = 0;
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

function convertToInteger(input) {
    if(!Number.isInteger(input)) {
        const index = input.indexOf('%timestamp');
        if( index != -1 ) {
            input = input.slice(0, index);
        }
        return Number.parseInt(input);
    } else {
        return input
    }
}