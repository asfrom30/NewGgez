const _ = require('lodash');

module.exports = function(heroIndexes, datePicker, diffGamesMap, statMap) {

    const obj = this;
    this.heroIndexes = heroIndexes;
    this.statMap = statMap;
    this.diffGameMap = diffGamesMap;
    this.datePicker = datePicker;

    this.getProfile = getProfile;
    this.getMost3 = getMost3;
    this.getTrend = getTrend;

    function getProfile(crawlDatas, lang) {
        lang = lang || 'kr';
        const dateIndex = 'current';

        //FIXME: replace with lang
        const cptptIndex = 'cptpt'; 
        const gamePlayedIndex = '치른게임';
        const gameWonIndex = '승리한게임';
        const gameLostIndex = '패배한게임';
        
        return {
            cptpt : getMetaValue(crawlDatas, dateIndex, cptptIndex),
            totalGame : getHeroValue(crawlDatas, dateIndex, 'all', gamePlayedIndex),
            winGame : getHeroValue(crawlDatas, dateIndex, 'all', gameWonIndex),
            loseGame : getHeroValue(crawlDatas, dateIndex, 'all', gameLostIndex),
        }
    }
    
    function getTrend(crawlDatas, lang){
        const datePicker = obj.datePicker;
        let dateIndexs = ['week', 'yesterday', 'today'];

        const gamePlayedIndex = "치른게임";
        const gameWonIndex = "승리한게임";
        const gameTiedIndex = "무승부게임";
        const gameLostIndex = "패배한게임";
        const burningTimeIndex = '폭주시간';
        const cptptIndex = 'cptpt';
        
        const diffCptpts = {};
        const winRates = {};

        for(let dateIndex of dateIndexs){
            let indexes = datePicker.getIndexes(dateIndex);
            winRates[dateIndex] = {
                totalGames : getHeroDiffValue(crawlDatas, indexes.A, indexes.B, 'all', gamePlayedIndex),
                winGames : getHeroDiffValue(crawlDatas, indexes.A, indexes.B, 'all', gameWonIndex),
                drawGames : getHeroDiffValue(crawlDatas, indexes.A, indexes.B, 'all', gameTiedIndex),
                loseGames : getHeroDiffValue(crawlDatas, indexes.A, indexes.B, 'all', gameLostIndex),
                winRate : divide(
                    getHeroDiffValue(crawlDatas, indexes.A, indexes.B, 'all', gameWonIndex),
                    getHeroDiffValue(crawlDatas, indexes.A, indexes.B, 'all', gamePlayedIndex)
                )
            }

            diffCptpts[dateIndex] = {
                before : getMetaValue(crawlDatas, indexes.B, 'cptpt'),
                after : getMetaValue(crawlDatas, indexes.A, 'cptpt'),
                diffCptpt : getDiffCptpt(
                    getMetaValue(crawlDatas, indexes.B, 'cptpt'),
                    getMetaValue(crawlDatas, indexes.A, 'cptpt')
                ), 
            }
        }

        // add current winRates
        winRates.current = {
            totalGames : getHeroValue(crawlDatas, 'current', 'all', gamePlayedIndex),
            winGames : getHeroValue(crawlDatas, 'current', 'all', gameWonIndex),
            drawGames : getHeroValue(crawlDatas, 'current', 'all', gameTiedIndex),
            loseGames : getHeroValue(crawlDatas, 'current', 'all', gameLostIndex),
            winRate : divide(
                getHeroValue(crawlDatas, 'current', 'all', gameWonIndex),
                getHeroValue(crawlDatas, 'current', 'all', gamePlayedIndex),
            ),
        }

        return {
            diffCptpt : diffCptpts,
            winRates : winRates,
        }
    }
    
    function getMost3(crawlDatas, lang){

        const kdaIndex = '목숨당처치';
        const gamePlayedIndex = "치른게임";
        const gameWonIndex = "승리한게임";
        const gameTiedIndex = "무승부게임";
        const gameLostIndex = "패배한게임";
        const burningTimeIndex = '폭주시간';
        
        const mosts = [];
        for(const heroIndex of heroIndexes) {
            if(heroIndex == 'all') continue;
            const gamePlayed = getHeroValue(crawlDatas, 'current', heroIndex, gamePlayedIndex);

            if(gamePlayed == undefined) continue;
            
            const result = {
                key : heroIndex,
                heroIndex : heroIndex,
                
                totalGames : getHeroValue(crawlDatas, 'current', heroIndex, gamePlayedIndex),
                winGames : getHeroValue(crawlDatas, 'current', heroIndex, gameWonIndex),
                drawGames : getHeroValue(crawlDatas, 'current', heroIndex, gameTiedIndex),
                loseGames : getHeroValue(crawlDatas, 'current', heroIndex, gameLostIndex),
                winRate : divide(
                    getHeroValue(crawlDatas, 'current', heroIndex, gameWonIndex),
                    getHeroValue(crawlDatas, 'current', heroIndex, gamePlayedIndex),
                ),
                kda : getHeroValue(crawlDatas, 'current', heroIndex, kdaIndex),
                burningTime : getHeroValue(crawlDatas, 'current', heroIndex, burningTimeIndex),
                avgScore : undefined,
            }

            mosts.push(result);
        }

        /* Sort by Value */
        mosts.sort(function (a, b) {
            const totalGamesA = a.totalGames;
            const totalGamesB = b.totalGames;
            return totalGamesB - totalGamesA;
        });

        return mosts.slice(0,3);
    }
}

function getMetaValue(crawlDatas, dateIndex, statIndex) {
    try {
        let result =  crawlDatas[dateIndex].meta[statIndex];
        result = parseFloat(result);
        if(isNaN(result)) return undefined;
        else return result; 
    } catch (error) {
        return undefined;
    }
}

function getHeroValue(crawlDatas, dateIndex, heroIndex, statIndex){
    try {
        let result = crawlDatas[dateIndex].data[heroIndex][statIndex];
        result = parseFloat(result);
        if(isNaN(result)) return undefined;
        else return result; 
    } catch (error) {
        return undefined;
    }
}

// This uses only for hero value, not use diff cptpt(minus value reutnr undefined)
function getHeroDiffValue(crawlDatas, dateIndexA, dateIndexB, heroIndex, statIndex) {
    const valueA = getHeroValue(crawlDatas, dateIndexA, heroIndex, statIndex);
    const valueB = getHeroValue(crawlDatas, dateIndexB, heroIndex, statIndex);

    if(valueA == undefined || valueB == undefined) return undefined;

    const result = valueA - valueB;

    if(result < 0 || isNaN(result)) return undefined;
    else return result;

}

function getDiffCptpt(beforeCptpt, afterCptpt) {
    if(beforeCptpt == undefined || afterCptpt == undefined) return undefined;
    const result = afterCptpt - beforeCptpt;
    if(isNaN(result)) return undefined;
    else return result;
}

function isEmptyObject(obj){
    if(Object.keys(obj).length === 0 && obj.constructor === Object) return true;
    else return false;
}

function divide(numerator, denominator){
    if(numerator == undefined || denominator == undefined) return undefined;
    if(denominator == 0) return undefined;

    const result = numerator/denominator;
    if(isNaN(result)) return undefined;
    else return result;
}
