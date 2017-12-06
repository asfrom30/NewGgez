const appCtrl = require('./app/app.crawl.server.controller');

/* Init : Database Connect */
var crawlConfig = {
    lang : 'ko-kr',
    device : 'pc',
    region : 'kr',
}

var dbConfig = {
    dbBaseUrl : 'mongodb://localhost/',
    dbName : 'pc_kr_web',
}

let mongoose = require('../crawl-cron-server/config/mongoose');
mongoose.init(dbConfig.dbBaseUrl + dbConfig.dbName);

appCtrl.convert();