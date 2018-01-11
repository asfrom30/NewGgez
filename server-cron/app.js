const path = require('path');
setAppRootPath();

/* App Module loading */
// const appLogger = require('');

// ini file loading...

// start server
// const appCronServer = require('./core');
// appCronServer.start();

const CronManager = require('./core/cron-manager');
const iniFileLoader = require('./core/ini-file-loader');
const config = require('./config/enviroment')

const onTickFactory = require('./core/on-tick-factory');

const serverConfigFilePath = path.join(__dirname, "cron.server.config.ini");

// https://www.npmjs.com/package/console-stamp
require('console-stamp')(console, { pattern: 'dd/mm/yyyy HH:MM:ss' });



/* print current enviroment */
console.info(`server is running on ${process.env.NODE_ENV} mode`);
console.info(`run on init : ${config.cron.runOnInit}, cron job start : ${config.cron.start}`);

// TODO:wait for user input... in dev mode.

iniFileLoader.getCronJobs(serverConfigFilePath).then(cronJobInfos => {
    console.info(`${Object.keys(cronJobInfos).length} cron jobs loaded from ini files\r\n`);
    
    const cronManager = new CronManager();
    cronManager.buildCronParams(cronJobInfos);
    cronManager.buildCrawlConfigs(cronJobInfos);
    cronManager.buildSaveConfigs(cronJobInfos);

    /* build onTick Chain */
    cronManager.addOnTick(onTickFactory.addDailyConfig);
    cronManager.addOnTick(onTickFactory.notifyCronStart);
    // cronManager.addOnTick(onTickFactory.needToDropTodayCollection);
    cronManager.addOnTick(onTickFactory.getAllPlayerCrawlAndSave);
    cronManager.addOnTick(onTickFactory.getAnalyzeTierData);
    // cronManager.addOnTick(onTickFactory.getRanking);
    cronManager.addOnTick(onTickFactory.sendReport);
    cronManager.addOnTick(onTickFactory.notifyCronFinish);

    cronManager.startCron();
}).then(()=>{
    // appLogger.info("   > Welcome doyoon, Now Crawl server on start");
    // appLogger.info("   > Analyze Properties file");
}).catch((reason)=>{
    console.log(reason);
})

function setAppRootPath() {
    global.appRoot = path.resolve(__dirname);
}
