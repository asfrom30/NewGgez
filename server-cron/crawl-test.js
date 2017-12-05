/* Enviorment Setting */
let args = process.argv;
let envArg = args[2];

if(!(envArg == 'dev' || envArg == "prod" || envArg == "debug")) {
    console.log('Enviormetn setting is not proper.. ');
    return;
} else {
    process.env.NODE_ENV = envArg;
    // process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
}

/* For node arguments... */
// var btg = process.argv[2];
// console.log("Crawl Test Start :: btg is " + btg);

/* For Global Config */
// const config = require('../crawl-cron-server/config/config');
// var dbUrl = config.dbBaseUrl + config.dbName;

var crawlConfig = {
    lang : 'ko-kr',
    device : 'pc',
    region : 'kr',
}

var dbConfig = {
    dbBaseUrl : 'mongodb://localhost/',
    dbName : 'pc_kr_web',
}

/* Init : Database Connect */
let mongoose = require('../crawl-cron-server/config/mongoose');
mongoose.init(dbConfig.dbBaseUrl + dbConfig.dbName);

/* Crawl */
var appCrawlController = require('../crawl-cron-server/app/controller/controller.crawl.server');
appCrawlController.doDailyTask(crawlConfig, dbConfig);
// appCrawlController.doDailyTaskWithBtg(crawlConfig, dbConfig, '냅둬라날-3934');
// appCrawlController.doDailyTaskWithRange(crawlConfig, dbConfig, 1, 40);




