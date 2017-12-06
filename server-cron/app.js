/* App Module loading */
// const appLogger = require('');

// ini file loading...

// start server
// const appCronServer = require('./core');
// appCronServer.start();
const path = require('path');
const CronManager = require('./core/cron-manager');
const iniFileLoader = require('./core/ini-file-loader');
const config = require('./config/enviroment')
const onTickFactory = require('./core/on-tick-factory');

const serverConfigFilePath = path.join(__dirname, "cron.server.config.ini");

iniFileLoader.getCronJobs(serverConfigFilePath).then(cronJobInfos => {
    console.log(`${Object.keys(cronJobInfos).length} cron jobs loaded from ini files`);
    
    const cronManager = new CronManager();
    cronManager.buildCronParams(cronJobInfos);
    cronManager.buildCrawlConfigs(cronJobInfos);
    cronManager.buildSaveConfigs(cronJobInfos);

    /* build onTick Chain */
    cronManager.addOnTick(onTickFactory.getAllPlayerCrawlAndSave);
    cronManager.addOnTick(onTickFactory.getAnalyzeTierData);
    cronManager.addOnTick(onTickFactory.getAnalyzeTierData);
    // cronManager.addOnTick(onTickFactory.getRanking;

    cronManager.startCron();
}).then(()=>{
    // appLogger.info("   > Welcome doyoon, Now Crawl server on start");
    // appLogger.info("   > Analyze Properties file");
}).catch((reason)=>{
    console.log(reason);
})
