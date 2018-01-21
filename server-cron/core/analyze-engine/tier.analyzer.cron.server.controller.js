'use strict';
const appDao = require('../dao');

exports.analyzeAsync = function(saveConfig) {

    const device = saveConfig.device;
    const region = saveConfig.region;
    const todaySuffix = saveConfig.todaySuffix;

    /* Dependency Injection */
    
    const heroIndexes = [
        "all", "soldier76", "reaper", "pharah", "reinhardt", "roadhog",
        "winston", "dva", "symmetra" , "widowmaker", "tracer", "hanzo",
        "mercy", "zenyatta", "genji", "torbjoern", "junkrat", "zarya",
        "mei", "ana", "lucio", "sombra", "doomfist", "orisa"
    ];
    const tierIndexes = ["bronze", "silver", "gold", "platinum", "diamond", "master", "grandmaster", "heroic"];
    tierIndexes.push('total');
    
    const tierGteLtes = require('../../externals/const/tiermap');
    
    const lang = 'ko-kr';
    const aggregateQuery = [];
    const gamePlayedIndex = '치른게임'; //FIXME: Must have lang param
    const statMap = require('../analyze-engine/stat-map-client.json');
    const denominators = statMap.denominators;
    const heroStatMap = statMap.heroes;

    /* Make Aggregate Query */
    for(let heroIndex of heroIndexes) {
        for(const tierIndex of tierIndexes) {
            const gte =tierGteLtes[tierIndex].gte;
            const lte = tierGteLtes[tierIndex].lte;

            /* Make `Matcher Aggregate` */
            const arrMatcher = [
                getGteComp( `_value.${heroIndex}.${gamePlayedIndex}`, 10),
                getGteLteComp("_meta.cptpt", gte, lte)
            ];

            const matcher = getMatcherWithMultipleComp(arrMatcher);
            
            /* Make `addFields Aggregate` using WinRate Field */

            /* Make `addFields Aggregate` using statmap Field */
            let addFields = getEmptyAddFields();
            
            for(const denominator of denominators) {
                const denominatorIndex = denominator[lang];
                for(const stat of heroStatMap[heroIndex]) {
                    const statId = `${stat.id}_per_${denominator.id}`;
                    const numeratorIndex = stat[lang];
                    addFields.$addFields[statId] = getDivideArithmetic(heroIndex, numeratorIndex, denominatorIndex);
                }
            }

            /* Make `Group Aggregate` */
            let groupStage = getEmptyGroupStage();
            for(const denominator of denominators) {
                for(const stat of heroStatMap[heroIndex]) {
                    const statId = `${stat.id}_per_${denominator.id}`;
                    groupStage.$group._id = heroIndex;
                    groupStage.$group.count = {$sum: 1};
                    groupStage.$group[statId + "_max"] = getGroupAccumulator('max', statId);
                    groupStage.$group[statId + "_min"] = getGroupAccumulator('min', statId);
                    groupStage.$group[statId + "_avg"] = getGroupAccumulator('avg', statId);
                }
            }

            let projectStage = getEmptyProjectStage();
            projectStage.$project = {};
            projectStage.$project.count = "$count";
            for(const denominator of denominators) {
                for(const stat of heroStatMap[heroIndex]) {
                    const statId = `${stat.id}_per_${denominator.id}`;
                    projectStage.$project[statId] = {};
                    projectStage.$project[statId].max = '$' + statId + "_max";
                    projectStage.$project[statId].min = '$' + statId + "_min";
                    projectStage.$project[statId].avg = '$' + statId + "_avg";
                }
            }


            /* out stage */
            // let outStage = {$out : 'tierdatas-' + currentDate};

            /* result */
            let aggregateDocs = [];
            aggregateDocs.push(matcher);
            aggregateDocs.push(addFields);
            aggregateDocs.push(groupStage);
            aggregateDocs.push(projectStage);
            // aggregate.push(outStage);
            //TODO: refactoring for sequence
            appDao.doAggregate(device, region, todaySuffix, aggregateDocs).then(result => {
                const docKey = `${heroIndex}.${tierIndex}`;
                const docValue = result[0];
                const doc = {$set : {}};
                doc.$set[docKey] = docValue;
                appDao.updateTierData(device, region, todaySuffix, doc);
            }).catch((reason) => {
                console.log(`err occured in ${heroIndex} ${tierIndex}`);
                console.log(reason);
            });

            /* Debug */
            // console.dir(matcher, { depth: null });
            // console.dir(addFields, { depth: null });
            // console.dir(groupStage, { depth: null });
            // console.dir(projectStage, { depth: null });
            // if(heroId == 'dva' && tierKey == 'silver') {
            //     console.dir(aggregate, { depth: null });
            // }
        }
    }

    return;
}

/* Mongodb Aggregate Comparison */
function getGteLteComp(compKey, gte, lte){
    let comp = {};
    comp[compKey] = {$gte : gte, $lte : lte}
    return comp;
}

function getGteComp(compKey, gte) {
    let comp = {};
    comp[compKey] = {$gte : gte};
    return comp;
}


/* Mongodb Aggregate Matcher */
function getMatcherWithSingleComp(matcher){
    // not yet tested...
    return {$match : matcher};
}

function getMatcherWithMultipleComp(arrMatcher){
    return {$match : {$and : arrMatcher}};
}

/* Mongodb Arithmetic */
function getDivideArithmetic(heroId, nume, deno){
    nume = "$_value." + heroId + "." + nume;
    deno = "$_value." + heroId + "." + deno;
    return {$divide : [nume, deno]};
}

/* Mongodb Aggregate addFields */
function getEmptyAddFields(){
    return { $addFields : {}};
}

/* Mongodb Aggregate group */
function getEmptyGroupStage(){
    return { $group : {}};
}

/* Mongodb group accumulator in `Group Aggregate`*/
function getGroupAccumulator(type, target) {
    let result = {};

    switch (type) {
        case 'max' :
            result = {$max : "$" + target};
            break;
        case 'min' :
            result = {$min : "$" + target};
            break;
        case 'avg' :
            result = {$avg : "$" + target};
            break;
        default : 
            //TODO: error handling;
            break;
    }
    return result;
}

function getEmptyProjectStage(){
    return {$project: {}}
}

