module.exports = function(heroIndexes, tierIndexes, statMap, datePicker) {
    const obj = this;
    this.heroIndexes = heroIndexes;
    this.tierIndexes = tierIndexes;
    this.statMap = statMap;
    this.datePicker = datePicker;

    this.getStatIndexes = function() {
        const heroIndexes = obj.heroIndexes;
        const statMap = obj.statMap;
        const denominators = statMap.denominators;
        const heroStatMap = statMap.heroes;
        
        const result = {};
        for(const denominator of denominators) {
            result[denominator.id] = {};
            for(const heroIndex of heroIndexes) {
                result[denominator.id][heroIndex] = [];
                const temp = result[denominator.id][heroIndex];
                for(const stat of heroStatMap[heroIndex]) {
                    const statId = `${stat.id}_per_${denominator.id}`;
                    temp.push(statId);
                }
            }
        }
        return result;
    }

    this.getPlayerDataSet = function(crawlDatas, dateIndexes, tierData) {
        const heroIndexes = obj.heroIndexes;
        const datePicker = obj.datePicker;
        const langIndex = 'ko-kr';

        const statMap = obj.statMap;
        const denominators = statMap.denominators;
        const heroStatMap = statMap.heroes;

        const result ={};
        for(const denominator of denominators) {
            result[denominator.id] ={};
            for(const dateIndex of dateIndexes) {
                result[denominator.id][dateIndex] = {};
    
                if(dateIndex == 'season') {
                    for(const heroIndex of heroIndexes) {
                        result[denominator.id][dateIndex][heroIndex] = {};

                        for(const stat of heroStatMap[heroIndex]) {
                            const statId = `${stat.id}_per_${denominator.id}`;

                            const totalMax = getTierValue(tierData, heroIndex, 'total', statId, 'max');
                            const totalMin = getTierValue(tierData, heroIndex, 'total', statId, 'min');
                            const heroNumerator = getHeroValue(crawlDatas, 'current', heroIndex, stat[langIndex]);
                            const heroDenominator = getHeroValue(crawlDatas, 'current', heroIndex, denominator[langIndex]);
                            
                            result[denominator.id][dateIndex][heroIndex][statId] = {
                                id : statId,
                                score : divide(heroNumerator, heroDenominator),
                                point :  normalize(totalMax, totalMin, divide(heroNumerator, heroDenominator))
                            };
                        }
                    }
                } else {
                    const dateIndexes = datePicker.getIndexes(dateIndex);
                    for(const heroIndex of heroIndexes) {
                        result[denominator.id][dateIndex][heroIndex] = {};

                        for(const stat of heroStatMap[heroIndex]) {
                            const statId = `${stat.id}_per_${denominator.id}`;

                            const totalMax = getTierValue(tierData, heroIndex, 'total', statId, 'max');
                            const totalMin = getTierValue(tierData, heroIndex, 'total', statId, 'min');
                            const heroNumerator = getHeroDiffValue(crawlDatas, dateIndexes.A, dateIndexes.B, heroIndex, stat[langIndex]);
                            const heroDenominator = getHeroDiffValue(crawlDatas, dateIndexes.A, dateIndexes.B, heroIndex, denominator[langIndex]);

                            result[denominator.id][dateIndex][heroIndex][statId] = {
                                id : statId,
                                score : divide(heroNumerator, heroDenominator),
                                point :  normalize(totalMax, totalMin, divide(heroNumerator, heroDenominator))
                            };
                        }
                    }
                }
    
            }
        }
        return result;
    }

    this.getTierDataSet = function(tierData) {
        const heroIndexes = obj.heroIndexes;
        const tierIndexes = obj.tierIndexes;
        tierIndexes.push('total');
        
        const statMap = obj.statMap;
        const denominators = statMap.denominators;
        const heroStatMap = statMap.heroes;
        
        let result = {};
        for(const denominator of denominators) {
            const tempResult = {};
            for(const tierIndex of tierIndexes) {
                const tierTempResult = {};
                for(const heroIndex of heroIndexes) {
                    tierTempResult[heroIndex] = {};
                    for(const stat of heroStatMap[heroIndex]) {
                        const statId = `${stat.id}_per_${denominator.id}`;
                        const totalMax = getTierValue(tierData, heroIndex, 'total', statId, 'max');
                        const totalMin = getTierValue(tierData, heroIndex, 'total', statId, 'min');
                        const tierAvg = getTierValue(tierData, heroIndex, tierIndex, statId, 'avg');
                        tierTempResult[heroIndex][statId] = {
                            id : statId,
                            score : tierAvg,
                            point : normalize(totalMax, totalMin, tierAvg)
                        }
                    }
                }
                tempResult[tierIndex] = tierTempResult;
            }
            result[denominator.id] = tempResult;
        }
        return result;
    }

    this.getHeroDiffGames = function(crawlDatas, dateIndexes) {
        const result = {};
        const heroIndexes = obj.heroIndexes;
        const datePicker = obj.datePicker;

        const gamePlayedIndex = "치른게임";
        const gameWonIndex = "승리한게임";
        const gameTiedIndex = "무승부게임";
        const gameLostIndex = "패배한게임";

        for(let dateIndex of dateIndexes){
            const tempResult = {};
            
            if(dateIndex == 'season') {
                for(let heroIndex of heroIndexes) {
                    tempResult[heroIndex] = {
                        totalGames : getHeroValue(crawlDatas, 'current', heroIndex, gamePlayedIndex),
                        winGames : getHeroValue(crawlDatas, 'current', heroIndex, gameWonIndex),
                        drawGames : getHeroValue(crawlDatas, 'current', heroIndex, gameTiedIndex),
                        loseGames : getHeroValue(crawlDatas, 'current', heroIndex, gameLostIndex),
                        winRate : divide(
                            getHeroValue(crawlDatas, 'current', heroIndex, gameWonIndex),
                            getHeroValue(crawlDatas, 'current', heroIndex, gamePlayedIndex),
                        ),
                    }
                }
            } else {
                const indexes = datePicker.getIndexes(dateIndex);
                for(let heroIndex of heroIndexes) {
                    tempResult[heroIndex] = {
                        totalGames : getHeroDiffValue(crawlDatas, indexes.A, indexes.B, heroIndex, gamePlayedIndex),
                        winGames : getHeroDiffValue(crawlDatas, indexes.A, indexes.B, heroIndex, gameWonIndex),
                        drawGames : getHeroDiffValue(crawlDatas, indexes.A, indexes.B, heroIndex, gameTiedIndex),
                        loseGames : getHeroDiffValue(crawlDatas, indexes.A, indexes.B, heroIndex, gameLostIndex),
                        winRate : divide(
                            getHeroDiffValue(crawlDatas, indexes.A, indexes.B, heroIndex, gameWonIndex),
                            getHeroDiffValue(crawlDatas, indexes.A, indexes.B, heroIndex, gamePlayedIndex)
                        )
                    }
                }
            }
            result[dateIndex] = tempResult;
        }
        return result;
    }
}

function getHeroDiffValue(crawlDatas, dateIndexA, dateIndexB, heroIndex, statIndex) {
    const valueA = getHeroValue(crawlDatas, dateIndexA, heroIndex, statIndex);
    const valueB = getHeroValue(crawlDatas, dateIndexB, heroIndex, statIndex);

    if(valueA == undefined || valueB == undefined) return undefined;

    const result = valueA - valueB;
    if(result < 0 || isNaN(result)) return undefined;
    else return result;
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

function getTierValue(tierData, heroIndex, tierIndex, statIndex, operation) {
    try {
        let result = tierData[heroIndex][tierIndex][statIndex][operation];
        result = parseFloat(result);
        if(isNaN(result)) return undefined;
        else return result; 
    } catch (error) {
        return undefined;
    }
}
function divide(numerator, denominator){
    if(numerator == undefined || denominator == undefined) return undefined;
    if(denominator == 0) return undefined;

    const result = numerator/denominator;
    if(isNaN(result)) return undefined; // isFinite(123) = true
    else return result;
}

function normalize(max, min, value) {
    if(max == undefined || min == undefined || value == undefined) return undefined;
    const result = (value - min) / (max - min);
    if(isNaN(result)) return undefined;
    else return result;
}


