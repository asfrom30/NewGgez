'use strict';
var mongoose = require('mongoose');
var momentTz = require('moment-timezone');

const utils = require('../../common/utils/common.utils');
var appCrawlCtrl = require('./crawl/crawler.crawl.server.controller');
var appDao = require('./dao/dao.crawl.server.controller');
var appDomFilterCtrl = require('./dom-filter/dom.filter.crawl.server');

/* Create 'PlayerData' Mongoose Model Globally */
var playerDataSchema = require('../model/player.data.schema');
var currentDate = momentTz().tz('Asia/Seoul').format('YY-MM-DD');

mongoose.model('PlayerData', playerDataSchema.get(), 'playerdatas-' + currentDate);
var PlayerData = mongoose.model('PlayerData');

/* */
const appAnalyzerCtrl = require('../controller/analyzer/analyzer.crawl.server.controller');

exports.doDailyTask = function(crawlConfig, dbConfig){
    var dbName = dbConfig.dbName;
    // TODO: check database is existed.

    // TODO: Collection Name must be replaced
    appDao.findAllPlayers(dbName)
        .then(function(playerlist){
            utils.log('Start Daily Task, Player length is ' + playerlist.length);
            playerlist.reduce(function(prePromise, currentValue, currentIndex, array){
                let btg = currentValue.btg;
                prePromise = makeDailyTaskChain(prePromise, btg, crawlConfig, dbConfig);
                return prePromise;
                // return makeDailyTaskChain(prePromise, btg, crawlConfig, dbConfig);

            }, Promise.resolve());
        })
}

exports.doDailyTaskWithRange = function(crawlConfig, dbConfig, start, end){
    var dbName = dbConfig.dbName;
    // TODO: check database is existed.

    appDao.findAllPlayers(dbName)
        .then(function(playerlist){
            utils.log('Start Daily Task, Player length is ' + playerlist.length);
            var partOfPlayers = [];
             
            for(var i = start; i < end; i++){
                partOfPlayers.push(playerlist[i]);
            }

            partOfPlayers.reduce(function(prePromise, currentValue, currentIndex, array){
                let btg = currentValue.btg;
                prePromise = makeDailyTaskChain(prePromise, btg, crawlConfig, dbConfig);
                return prePromise;
            }, Promise.resolve());
        })
}

exports.doDailyTaskWithBtg = function(crawlConfig, dbConfig, btg){
    let lang = crawlConfig.lang;
    let device = crawlConfig.device;
    let region = crawlConfig.region;
    crawlAndInsertData('', '', lang, device, region, btg);
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

exports.buildTierData = function(dbConfig) {

    let currentDate = '17-11-09';
    /* Target Data base */
    let dbUri = dbConfig.baseUri + dbConfig.name;
    let targetCollectionName = 'playerdatas-' + currentDate;
    let outputCollectionName = 'tierdatas-' + currentDate;
    
    /* Dependency Injection */
    let client = require('mongodb').MongoClient;
    let heroMap = require('../externals/heromap');
    let statMap = require('../externals/statmap');
    let tierMap = require('../externals/tiermap');

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

            /* Save doc... */
            client.connect(dbUri).then(function(db){
                db.collection(targetCollectionName).aggregate(aggregateDocs, function(err, result){
                    if(err) {
                        console.log('err occured :  ' + heroId +", " + tierKey);
                        console.log(err);
                        db.close();
                    } else {
                        let doc = {$set : {}};
                        doc.$set[tierKey] = result[0];
                        db.collection(outputCollectionName).update({_id : heroId}, doc, {upsert : true}, function(err, result) {
                            if(err) {
                                console.log('err occured :  ' + heroId +", " + tierKey);
                            } else {
                                console.log('save ' + heroId +", " + tierKey);
                            };
                            db.close();
                        })
                    }
                })
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

    let arrAggregate = ['a', 'b', 'c' ];

    arrAggregate.reduce(function(preValue, currentValue, currentIndex, array){
        let wrapPromise = preValue.then(
            setTimeout(function(){
                console.log(array[currentIndex]);
                return;
            }, 1000)
        );
        return wrapPromise;
    }, Promise.resolve());

    // Promise chain을 만든다.
    // out을 temp에 두고
    // callback 함수에서 해당 data를 tier-data로 옮겨준다...


   

   
}

function makeDailyTaskChain(prePromise, btg, crawlConfig, dbConfig){
    return prePromise.then(result => {
        /* Crawl */
        if(typeof btg == 'undefined') return prePromise;
        else return crawlAsync(crawlConfig, btg);
    }).then(crawledObj => {
        /* Filter */
        utils.log(btg + 'crawl success', 'white');
        if(Object.keys(crawledObj).length === 0 && crawledObj.constructor === Object) return {};   // objs empty check
        else return appDomFilterCtrl.refine(crawlConfig.lang, crawledObj);
    }).then(refinedObj => {
        var playerData = new PlayerData({_id : btg, _meta : refinedObj._meta, _value : refinedObj._value});
        playerData.save(insertErrorCallback(btg));
    }).catch((reason) => {
        // TODO: Crawling failed... in this battle tag...
        console.log(reason);
        console.log('\x1b[33m%s\x1b[0m', 'error occured : ' + btg + 'is not inserted');
    })
}



function insertErrorCallback(btg){
    return function(err) {
        if(err) {
            // error handling
            console.log(err); // If duplicate key is existed, occur here
        } else {
            let currentDate = momentTz().tz('Asia/Seoul').format('YY-MM-DD hh-mm-ss');
            utils.log('btg:' + btg + ' stat inserted :: ' + currentDate, 'magenta');
        }
    }
}

// exports.doWithRange = function(start, end) {
//     appDao.findAllPlayers('pc_kr')
//         .then(result => {
//             var dummies = [];
            
//             for(var i = start; i < end; i++){
//                 dummies.push(players[i]);
//             }

//             /* Fetch All Players Data */
//             dummies.reduce(function(preValue, currentValue, currentIndex, array){
//                     return preValue.then(result => {
//                             if(typeof currentValue.btg == 'undefined') return preValue;
//                             else return crawlAndInsertData('', '', lang, device, location, currentValue.btg);
//                         }).catch((reason) => {
//                             // Todo... Crawling failed... in this battle tag...
//                             console.log('\x1b[33m%s\x1b[0m', 'error occured : ' + currentValue.btg);
//                         });
//                 }, Promise.resolve());
//         }, function(err){
//             //TODO: it occurs when stops while Crawlling, log files....
//             console.log(err);
//         }));
//         //FIXME: findAllPlayer then Crawl tehn Insert Data
//         // .then(function(objs){
//         //     // Tier Statics Calculater...
//         // }    
//         // .catch())
// }

function crawlAndInsertData(databaseName, collectionName, lang, device, region, btg){
    //TODO: this.lang, this.device, this.server validate check...

    if(databaseName == undefined) return Promise.reject(new Error('CronJob object, databaseName is null'));
    if(collectionName == undefined) return Promise.reject(new Error('CronJob object, collectionName is null'));
    if(lang == undefined) return Promise.reject(new Error('CronJob object, lang is null'));
    if(device == undefined) return Promise.reject(new Error('CronJob object, device is null'));
    if(region == undefined) return Promise.reject(new Error('CronJob object, location is null'));
    if(btg == undefined) return Promise.reject(new Error('CronJob object, btg is null'));

    var promise = appCrawlCtrl.doCrawl(lang, device, region, btg)
        .then(function(objs){
            if(Object.keys(objs).length === 0 && objs.constructor === Object) return objs;   // objs empty check
            else return appDomFilterCtrl.refine(lang, objs);
        })
        .then(objs => {
            // @deprecated
            // appDao.insertPlayerData(databaseName, collectionName, btg, objs);
            var playerData = new PlayerData({_id : btg, _meta : objs._meta, _value : objs._value});
            playerData.save(function(err) {
                if(err) {
                    // error handling
                } else {
                    let currentDate = momentTz().tz('Asia/Seoul').format('YY-MM-DD hh-mm-ss');
                    console.log('btg:' + btg + ' stat inserted :: ' + currentDate);
                }
            });
            }, reason => {
                console.log('insert error [btg] : ' + btg);
                console.log(reason);
                console.log();
        })
    return promise;
}

