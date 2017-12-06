'use strict';
const appDao = require('../dao');

exports.analyzeAsync = function(saveConfig) {

    const device = saveConfig.device;
    const region = saveConfig.region;
    const todaySuffix = saveConfig.todaySuffix;

    /* Dependency Injection */
    let client = require('mongodb').MongoClient;
    let heroMap = require('../../externals/const/heromap');
    let statMap = require('../../externals/const/statmap');
    let tierMap = require('../../externals/const/tiermap');

    let aggregateQuery = [];
    // need min playtimes set...
    // aggregate.push(getMatcher(10))
    // aggregate.push(addStatMapField(statMap))
    // ....
    // aggregate.push(remapObj)
    // aggregate.output

    /* Make Aggregate Query */
    for(let heroId of heroMap) {
        for(let tierKey in tierMap) {
            let tier = tierMap[tierKey];

            /* Make `Matcher Aggregate` */
            let arrMatcher = [];
            arrMatcher.push(getGteComp("_value." + heroId + ".치른게임", 10));;
            arrMatcher.push(getGteLteComp("_meta.cptpt", tier.gte, tier.lte));
            let matcher = getMatcherWithMultipleComp(arrMatcher);
            
            /* Make `addFields Aggregate` using WinRate Field */

            /* Make `addFields Aggregate` using statmap Field */
            let addFields = getEmptyAddFields();
            for(let stat of statMap[heroId]) {
                let statId = stat.label;
                let statNume = stat.numerator;
                let statDeno = stat.denominator;
                addFields.$addFields[statId] = getDivideArithmetic(heroId, statNume, statDeno);
            }

            /* Make `Group Aggregate` */
            let groupStage = getEmptyGroupStage();
            for(let stat of statMap[heroId]) {
                groupStage.$group._id = heroId;
                groupStage.$group.count = {$sum: 1};

                let statId = stat.label;
                groupStage.$group[statId + "_max"] = getGroupAccumulator('max', statId);
                groupStage.$group[statId + "_min"] = getGroupAccumulator('min', statId);
                groupStage.$group[statId + "_avg"] = getGroupAccumulator('avg', statId);
            }

            let projectStage = getEmptyProjectStage();
            projectStage.$project = {};
            projectStage.$project.count = "$count";
            for(let stat of statMap[heroId]) {
                let statId = stat.label;
                projectStage.$project[statId] = {};
                projectStage.$project[statId].max = '$' + statId + "_max";
                projectStage.$project[statId].min = '$' + statId + "_min";
                projectStage.$project[statId].avg = '$' + statId + "_avg";
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
            appDao.doAggregate(device, region, todaySuffix, aggregateDocs).then((result) => {
                const docKey = `${heroId}.${tierKey}`;
                const docValue = result[0];
                const doc = {$set : {}};
                doc.$set[docKey] = docValue;
                appDao.updateTierData(device, region, todaySuffix, doc);
            }).catch((reason) => {
                console.log(`err occured in ${heroId} ${tierKey}`);
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

