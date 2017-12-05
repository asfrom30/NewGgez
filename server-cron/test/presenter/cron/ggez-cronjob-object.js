/* Npm Module */
var momentTz = require('moment-timezone');

/* Custom Module */
var appCrawler = require('../crawl/ggez-crawler.js');
var appDomFilter = require('../crawl/ggez-dom-filter.js');
var appCrud = require('../../model/ggez-crud');

exports.CronJob = function (dbName, lang, device, location, timeZone){
    this.dbName = dbName;
    this.lang = lang;
    this.device = device;
    this.location = location;
    this.timeZone = timeZone;
    
    this.onTick = onTick(this.dbName, this.lang, this.device, this.location, this.timeZone);

    this.onStop = function(){
        console.log("stops.....");
    }

    this.callback = function (){
        console.log("hello");
    }
}

function onTick(databaseName, lang, device, location, timeZone){
    
    var currentDate = momentTz().tz(timeZone).format('YY_MM_DD');

    appCrud.findAllPlayers(databaseName)
    .then(function(players){

        var collectionName = 'stats_' + currentDate;


        /* Test */
        //crawlAndInsertData(databaseName, collectionName, lang, device, location, players[1].btg);

        // var dummies = [];
        // for(var i = 20; i < 30; i++){
        //     dummies.push(players[i]);
        // }

        /* Insert One Dummy test... refactoring */
        // var dummy = dummies[0];
        // console.log(dummy.btg);
        // crawlAndInsertData(databaseName, collectionName, lang, device, location, dummy.btg);

        
        /* Fetch All Players Data */
        players.reduce(function(preValue, currentValue, currentIndex, array){
        // dummies.reduce(function(preValue, currentValue, currentIndex, array){
            return preValue.then(result => {
                    if(typeof currentValue.btg == 'undefined') return preValue;
                    else return crawlAndInsertData(databaseName, collectionName, lang, device, location, currentValue.btg);
                }).catch((reason) => {
                    // Todo... Crawling failed... in this battle tag...
                    console.log('\x1b[33m%s\x1b[0m', 'error occured : ' + currentValue.btg);
                });
        }, Promise.resolve());

    }, function(err){
        //TODO: it occurs when stops while Crawlling, log files....
        console.log(err);
    });
    //FIXME: findAllPlayer then Crawl tehn Insert Data
    // .then(function(objs){
    //     // Tier Statics Calculater...
    // }    
    // .catch()
}

function crawlAndInsertData(databaseName, collectionName, lang, device, location, btg){
    //TODO: this.lang, this.device, this.server validate check...

    if(databaseName == undefined) return Promise.reject(new Error('CronJob object, databaseName is null'));
    if(collectionName == undefined) return Promise.reject(new Error('CronJob object, collectionName is null'));
    if(lang == undefined) return Promise.reject(new Error('CronJob object, lang is null'));
    if(device == undefined) return Promise.reject(new Error('CronJob object, device is null'));
    if(location == undefined) return Promise.reject(new Error('CronJob object, location is null'));
    if(btg == undefined) return Promise.reject(new Error('CronJob object, btg is null'));

    var promise = appCrawler.crawl(lang, device, location, btg)
        .then(function(objs){
            if(Object.keys(objs).length === 0 && objs.constructor === Object) return objs;   // objs empty check
            else return appDomFilter.refine(lang, objs);
        })
        .then(function(objs){
            appCrud.insertStat(databaseName, collectionName, btg, objs);
            console.log('btg:' + btg + ' stat inserted :: ');
        });

    return promise;
}