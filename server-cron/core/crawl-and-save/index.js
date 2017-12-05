
const _ = require('lodash');
const controller = require('./crawl.engine.controller');
const appDao = require('../dao/index');
const momentTz = require('moment-timezone');

exports.doAsync = doAsync;

function doAsync(id, btg, crawlConfig, saveConfig){

    saveConfig.todayCollectionSuffix = momentTz().tz(saveConfig.timezone).format('YYMMDD');

    return new Promise((resolve, reject) => {
        /* Crawl Page */
        if(typeof btg == 'undefined') {
            reject('btg is undefined');
            return;    
        } 
        
        const promise = controller.doCrawl(crawlConfig, btg).then((crawlRes) => {
            resolve(crawlRes)
        });
        
        return promise;
    }).then((crawlRes) => {
        /* DOM Parsing : Make meta and data */
        if(crawlRes.statusCode != 200) {
            return Promise.reject('This Battle Tag can not found in Blizzard');
        }

        const $ = crawlRes.$;
        const metaObj = controller.metaParser($);
        const heroObj = controller.heroParser($);
        return _.merge(metaObj, heroObj);
    }).then((result) => {
        //TODO: Preprocess crawl data
        /* Refine : timestamp */
        return new Promise((resolve, reject) => {
            setTimeout(function() {
                console.log('refine : ' + btg);
                result._id = id;
                result._btg = btg;
                resolve(result);
            }, 1000);
        })
    }).then((docs) => {
        return appDao.insertCrawlData(saveConfig.device, saveConfig.region, saveConfig.todayCollectionSuffix, docs);
        
    }).then(() => {
        console.log(`${btg} is crawl and save successfully`);
    }).catch((reason) => {
        // TODO: Crawling failed... in this battle tag...
        console.log('\x1b[33m%s\x1b[0m', 'error occured : ' + btg + 'is not inserted');
        console.log(reason);
        console.log();
    })
    

    // return prePromise.then(result => {
    //     /* Crawl */
    //     if(typeof btg == 'undefined') return prePromise;
    //     else return crawlAsync(crawlConfig, btg);
    // }).then(crawledObj => {
    //     /* Filter */
    //     utils.log(btg + 'crawl success', 'white');
    //     if(Object.keys(crawledObj).length === 0 && crawledObj.constructor === Object) return {};   // objs empty check
    //     else return appDomFilterCtrl.refine(crawlConfig.lang, crawledObj);
    // }).then(refinedObj => {
    //     var playerData = new PlayerData({_id : btg, _meta : refinedObj._meta, _value : refinedObj._value});
    //     playerData.save(insertErrorCallback(btg));
    // }).catch((reason) => {
    //     // TODO: Crawling failed... in this battle tag...
    //     console.log(reason);
    //     console.log('\x1b[33m%s\x1b[0m', 'error occured : ' + btg + 'is not inserted');
    // })
}

