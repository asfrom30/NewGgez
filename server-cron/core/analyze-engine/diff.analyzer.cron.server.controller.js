'use strict';
const fs = require('fs');
const path = require('path');
const util = require('util');



module.exports = {
    makeDiffAggregateDoc : makeDiffAggregateDoc
}

function makeDiffAggregateDoc(config, lang) {
    if(config == undefined) return Promise.reject('err_config_is_undefined');
    if(config.saveSuffix == undefined) return Promise.reject('err_saveSuffix_is_undefined');
    if(config.suffixA == undefined) return Promise.reject('err_suffixA_is_undefined');
    if(config.suffixB == undefined) return Promise.reject('err_suffixB_is_undefined');

    
    // no need to below
    const statMap = loadStatMap();
    if(statMap == undefined) return Promise.resolve(`err_can_not_read__statmap.json`); //TODO: how to handle this, if this code is reject other on tick will not excutes

    const saveSuffix = config.saveSuffix;
    const suffixA = config.suffixA;
    const suffixB = config.suffixB;

    const aggregateDocs = [];
    aggregateDocs.push(appendLookupPipeLine(suffixA));
    aggregateDocs.push(appendLookupPipeLine(suffixB));

    aggregateDocs.push(appendReplaceRootPipeLine());

    aggregateDocs.push(appendUnwindPipeLine(suffixA));
    aggregateDocs.push(appendUnwindPipeLine(suffixB));

    aggregateDocs.push(appendSubtractProject(statMap, suffixA, suffixB, lang));

    aggregateDocs.push(appendOutPipeLine(saveSuffix));
    return aggregateDocs;
}

function loadStatMap() {
    let result = undefined;
    try {
        const obj = fs.readFileSync(path.join(__dirname, `./stat-map.json`));
        result = JSON.parse(obj);
    } catch (error) {
        console.log(error);
    }

    return result;
}

function appendLookupPipeLine(suffix) {
    return {
        $lookup : {
            from : `crawl-datas-${suffix}`,
            localField : "_id",
            foreignField : "_id",
            as : `temp.${suffix}`,
        }
    }
}

function appendReplaceRootPipeLine() {
    return {
        $replaceRoot : {
            newRoot : "$temp"
        }
    }
}

function appendUnwindPipeLine(suffix) {
    return {
        $unwind : `$${suffix}`
    }
}

function appendSubtractProject(statMap, suffixA, suffixB, lang) {

    const denominators = statMap.denominators;
    const commonStats = statMap.common;
    const heroes = statMap.heroes;

    const projectObj = {};
    projectObj._id = `$${suffixA}._id`;
    projectObj.cptpt = `$${suffixA}.cptpt`;
    projectObj.diffCptpt = getMetaProjectOberation(suffixA, suffixB, 'cptpt');

    for(let hero in heroes) {
        // subtract denominator area
        for(let obj of denominators) {
            const id = obj.id;
            const crawledField = obj[lang];
            
            // projectObj[`${hero}.${id}`] = getSubtractOperation(suffixA, suffixB, hero, crawledField);
            projectObj[`${hero}.${id}`] = getValueProjectOperation(suffixA, suffixB, hero, crawledField);
        }

        // subtract common area
        for(let obj of commonStats) {
            const id = obj.id;
            const crawledField = obj[lang];
            // projectObj[`${hero}.${id}`] = getSubtractOperation(suffixA, suffixB, hero, field);
            projectObj[`${hero}.${id}`] = getValueProjectOperation(suffixA, suffixB, hero, crawledField);
        }

        const heroStats = heroes[hero];
        for(let obj of heroStats) {
            const id = obj.id;
            const crawledField = obj[lang];
            // projectObj[`${hero}.${id}`] = getSubtractOperation(suffixA, suffixB, hero, field);
            projectObj[`${hero}.${id}`] = getValueProjectOperation(suffixA, suffixB, hero, crawledField);
        }
    }
    return { $project : projectObj}
}

function getMetaProjectOberation(suffixA, suffixB, metaField) {
    const fieldA = `$${suffixA}._meta.${metaField}`;
    const fieldB = `$${suffixB}._meta.${metaField}`;

    const subtractOperation = getSubtractOperation(fieldA, fieldB);
    return wrapConditionOperation(fieldA, fieldB, subtractOperation);
}

function getValueProjectOperation(suffixA, suffixB, hero, crawledField) {
    const fieldA = `$${suffixA}._value.${hero}.${crawledField}`;
    const fieldB = `$${suffixB}._value.${hero}.${crawledField}`;

    const subtractOperation = getSubtractOperation(fieldA, fieldB);
    return wrapConditionOperation(fieldA, fieldB, subtractOperation);
}

function appendOutPipeLine(saveSuffix) {
    const collectionName = `diff-datas-${saveSuffix}`;
    return {
        $out : collectionName,
    }
}

function getSubtractOperation(fieldA, fieldB) {
    return {
        $subtract : [
            `${fieldA}`,
            `${fieldB}`
        ]
    }
}

function wrapConditionOperation(fieldA, fieldB, subtractOperation) {
    return {
        $cond : [
            {
                $or : [
                    {$eq : ['string', {$type : fieldA}]},
                    {$eq : ['string', {$type : fieldB}]},
                ]
            }
            , null
            , subtractOperation
        ]
    }
}