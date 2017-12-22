
const controller = require('./crawl.engine.controller');
// TODO: controller must be separated two section select and crawl..
// const dataSelector = require('./')
const dataCleaning  = require('./data.cleaning.cron.server.controller');
const appDao = require('../dao/index');

exports.doAsync = doAsync;
exports.onlyCrawlForRegister = onlyCrawlForRegister;

function doAsync(id, btg, crawlConfig, saveConfig){

    return new Promise((resolve, reject) => {
        console.log();
        console.log(`try to crawl and save : ${btg}`)
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
        /* Data Selection : Make meta and data */
        if(crawlRes.statusCode != 200) {
            return Promise.reject('This Battle Tag can not found in Blizzard');
        } else if(Object.keys(crawlRes).length === 0 && crawlRes.constructor === Object) {
            return Promise.reject('Crawled Res is empty...');
        }

        const $ = crawlRes.$;
        const metaObj = controller.metaParser($);
        const heroObj = controller.heroParser($);

        return {
            _id     : id,
            _btg    : btg,
            _meta   : metaObj.value,
            _value  : heroObj.value,
        }
    }).then((result) => {
        /* Data Cleaning : transfrom key lower case..*/
        // TODO: middleware pattern apply
        result._value = dataCleaning.getCleanValue(result._value);
        return result;
    }).then((result) => {
        /* Save Data */
        return appDao.insertCrawlData(saveConfig.device, saveConfig.region, saveConfig.todaySuffix, result);
    }).then((result) => {
        console.log(`${btg} is crawl and save successfully`);
        return result;
    }).catch((reason) => {
        // TODO: Crawling failed... in this battle tag...
        console.log('\x1b[33m%s\x1b[0m', 'error occured : ' + btg + 'is not inserted');
        console.log(reason);
    })
}

function onlyCrawlForRegister(device, region, btg) {

    //FIXME IT DEPEND ON INI FILE
    const crawlConfig = getCrawlConfig(device, region);

    return new Promise((resolve, reject) => {

        console.log();
        console.log(`try to only crawl : ${btg}`)
        /* Crawl Page */
        if(typeof btg == 'undefined') {
            reject('btg is undefined');
            return;    
        } 
        
        return controller.doCrawl(crawlConfig, btg).then((crawlRes) => {
            resolve(crawlRes)
        });
        
    }).then((crawlRes) => {
        /* Data Selection : Make meta and data */
        if(crawlRes.statusCode != 200) {
            return Promise.reject('This Battle Tag can not found in Blizzard');
        } else if(Object.keys(crawlRes).length === 0 && crawlRes.constructor === Object) {
            return Promise.reject('Crawled Res is empty...');
        }

        const $ = crawlRes.$;
        const metaObj = controller.metaParser($);
        const heroObj = controller.heroParser($);

        return {
            _btg    : btg,
            _meta   : metaObj.value,
            _value  : heroObj.value,
        }
    }).then((result) => {
        /* Data Cleaning : transfrom key lower case..*/
        // TODO: middleware pattern apply
        result._value = dataCleaning.getCleanValue(result._value);
        return result;
    }).then((result) => {
        console.log(`${btg} is only crawl for register successfully`);
        return result;
    }).catch((reason) => {
        // TODO: Crawling failed... in this battle tag...
        console.log('\x1b[33m%s\x1b[0m', 'error occured in Only Crawl: ' + btg + 'is not inserted');
        console.log(reason);
    })

}

function getCrawlConfig(device, region) {
    // switch (region) {
    //     case value:
            
    //         break;
    
    //     default:
    //         break;
    // }
    return {
        device : device,
        region : region,
        lang : 'ko-kr',
    }
}