
/* Cronjob : https://www.npmjs.com/package/cron */
const CronJob = require('cron').CronJob;
const config = require('../../config/enviroment');

module.exports = function(){
    /* variable */
    this.cronParams = {};
    this.crawlConfigs = {};
    this.saveConfigs = {};
    this.onTickEnv = {targetDb: 'as', url: 'ds'};
    this.onTickChain = [];

    /* function */
    this.buildCronParams = buildCronParams;
    this.buildCrawlConfigs = buildCrawlConfigs;
    this.buildSaveConfigs = buildSaveConfigs;
    this.addOnTick = addOnTick;
    this.startCron = startCron;
}

function buildCronParams(cronJobInfos){
    for(let key in cronJobInfos) {
        let cronJobInfo =  cronJobInfos[key];

        const tempCronParam = Object.assign({}, config.cron);
        tempCronParam.cronTime = cronJobInfo.cron_time;
        tempCronParam.timeZone = cronJobInfo.time_zone;
        
        this.cronParams[key] = tempCronParam;
    }
}

function buildCrawlConfigs(cronJobInfos) {
    for(let key in cronJobInfos) {
        const cronJobInfo =  cronJobInfos[key];
        
        const tempCrawlConfig = {};
        tempCrawlConfig.lang = cronJobInfo.target_lang;
        tempCrawlConfig.device = cronJobInfo.target_device;
        tempCrawlConfig.region = cronJobInfo.target_region;
        
        this.crawlConfigs[key] = tempCrawlConfig;
    }
}

function buildSaveConfigs(cronJobInfos) {
    for(let key in cronJobInfos) {
        const cronJobInfo =  cronJobInfos[key];

        const tempSaveConfig = {};
        tempSaveConfig.region = cronJobInfo.target_db_region;
        tempSaveConfig.device = cronJobInfo.target_db_device;
        tempSaveConfig.timezone = cronJobInfo.target_db_timezone;
        
        this.saveConfigs[key] = tempSaveConfig;
    }
}

function addOnTick(promiseObj){
    this.onTickChain.push(promiseObj);
}

function startCron() {
    for(let key in this.cronParams) {
        const cronParam = this.cronParams[key];
        const crawlConfig = this.crawlConfigs[key];
        const saveConfig = this.saveConfigs[key];
        cronParam.onTick = getOnTickFromChain(this.onTickChain, crawlConfig, saveConfig);
        new CronJob(cronParam);
    }
}

function getOnTickFromChain(onTickChain, crawlConfig, saveConfig){
    return function(){
        onTickChain.reduce((prePromise, currentOnTickPromise) => {
            return prePromise.then((result) => {
                return currentOnTickPromise(result, crawlConfig, saveConfig);
            });
        }, Promise.resolve(1));
    }
}