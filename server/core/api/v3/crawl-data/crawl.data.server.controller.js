/* replace with absolute path */
// const MongoDbHelper = require(appRoot + 'common/utils/logger');
const appDao = require('../../../services/dao');
const crawlAndSave = require('../../../../externals').crawlAndSave;
// const mongoDbHelperFactory = require('../../common/utils/db/mongo.db.helper.factory');


exports.update = updateCurrentCrawlData;

exports.storedId = function(req, res, next, id){
    id = Number.parseInt(id);
    req.id = id;
    next();
}

exports.query = function(req, res, next) {
    const device = req.device;
    const region = req.region;
    const id = req.id;

    //TODO: if device | region | id is not defined return 4xx response

    /* Date Query Parsing */
    // if query is undefined return {} object...
    // if(isNaN(req.params.id)) res.json({}); // id is not number..
    // TODO: Undefined check...
    /* preparing query */
    if(req.query.date == undefined) {
        res.status(400).json({err : 'date query is not defined, cf) "?date=171212,171213,current")', msg : '', value : ''});
        return;
    }
    var dates = req.query.date.split(",");

    var result = {};

    let promises = [];

    
    for(let date of dates){
        promises.push(appDao.findCrawlDataById(device, region, date, id));
    }

    Promise.all(promises).then(values => {
        res.status(200).json({msg : 'Get Crawl Datas success', err : '', value : values});
    }, reason => {
        res.status(500).send('Internal Server Error : Promise is not all resolved');
    });
}

function updateCurrentCrawlData(req, res, next) {
    const device = req.device;
    const region = req.region;
    const id = req.id;

    Promise.resolve().then(() => {
        return appDao.findPlayerById(device, region, id);
    }).then(playerDoc => {
        if(playerDoc == null) return Promise.reject('err_this_id_is_not_in_server');
        else return appDao.findCurrentCrawlDataById(device, region, id);
    }).then(crawlDataDoc => {
        if(crawlDataDoc == null) return Promise.resolve(); // id is registered, but not current date. need to update
        
        /* crawlTimeStamp is null, also need to update */
        const crawlTimeStamp = getCrawlTimeStamp();
        const nowTimestamp = getNowTimeStamp();
        if(crawlTimeStamp == null) return Promise.resolve();

        /* under 1 min update */
        if(needUpdate(nowTimestamp, crawlTimeStamp)) return Promise.resolve();
        else return Promise.reject('err_can_request_under_1_min');
    }).then(() => {
        return appDao.findPlayerBtgById(device, region, id);
    }).then(btg =>{
        return crawlAndSave.onlyCrawlForRegister(device, region, btg);
    }).then(crawlData => {
        let promises = [];

        promises.push(appDao.updatePlayer(device, region, id, getPlayerObj(crawlData)));
        promises.push(appDao.updateCurrentCrawlData(device, region, id, crawlData));
        // promises.push(); //FIXME: need set timeout error
        return Promise.all(promises);
    }).then(() => {
        res.send({msg:'msg_update_succesfully', value : ''});
    }).catch(reason => {
        console.log(reason);
        switch (reason) {
            case 'err_this_id_is_not_in_server':
                res.status(400).send({err: reason});
                break;
            case 'err_crawl_data_is_already_up_tp_date':
                res.status(400).send({err: reason});
                break
            default:
                //FIXME: Internal server error log must be logged in files in local.
                //because for debugging.
                //FIXME: err message must be separeted... in app utils...
                const errorCode = 1;
                res.status(500).send({err: `internal server error : ${errorCode}`});
                break;
        }
    })
}


function needUpdate(timeStampA, timeStampB) {
    
    if(isNaN(timeStampA) || isNaN(timeStampB)) return true;
    // //FIXME: MOVE APP CONFIG. 
    if(timeStampA - timeStampB > 60*1000) {
        return true;
    } else {
        return false;
    }
}

function getCrawlTimeStamp(doc) {
    try {
        return doc._meta.crawlTimeStamp;
    } catch (error) {
        return;
    }
}

function getNowTimeStamp() {
    return Date.now();
}


function getPlayerObj(crawlData) {
    let result = {};
    result.iconUrl = crawlData._meta.iconUrl;
    result.level = crawlData._meta.lowerLevel
    result.cptpt = crawlData._meta.cptpt;
    result.lastUpdateTimeStamp = getNowTimeStamp();
    return result;
}
