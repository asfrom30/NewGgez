
var crawler = require('../../../crawl-cron-server/app/controller/crawl/crawler.crawl.server.controller');
var appDomFilter = require('../../../crawl-cron-server/app/controller/dom-filter/dom.filter.crawl.server');

const logger = require(appRoot + '/common/utils/logger')

exports.doCrawlAndRefine = function(btg) {
    logger.log('Try to Crawl : ' + btg, 'crawl-log');

    let promise = crawler.doCrawl('ko-kr', 'pc', 'kr', btg)
        .then(objs => {
            if(Object.keys(objs).length === 0 && objs.constructor === Object) return objs;   // objs empty check
            else return appDomFilter.refine('', objs);
        });

    return promise;
}

exports.crawl = function(device, region, btg){
    return new Promise((resolve, reject) => {
        resolve({});
    })
}