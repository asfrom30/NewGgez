/* app utils */
const crawlAndSave = require('../../../../externals').crawlAndSave;
const appDao = require('../../../services/dao');
const momentService = require('../../../services/moment.core.service');

exports.findById = function(req, res, next, id) {

    const device = req.device;
    const region = req.region;
    id = Number.parseInt(id);

    appDao.findPlayerById(device, region, id).then(player => {
        req.player = player;
        next();
    })
}

exports.queryInBtg = function(req, res, next) {
    const device = req.device;
    const region = req.region;
    const btg = req.query.btg;

    if(btg == undefined) {
        res.status(404).send('btg is not defined');
        return;
    }

    findByBtg(device, region, btg).then(player=>{
        sendPlayer(res, player);
        return;
    }).catch(reason => {
        res.status(500).send(reason);
        return;
    })
} 

exports.read = function(req, res, next) {
    console.log('adsfasdf');
    sendPlayer(res, req.player);
}

exports.register = function(req, res, next) {
    const device = req.device;
    const region = req.region;
    const btg = req.body.btg;

    if(btg == undefined) {
        res.status(404).send({err: 'wish_to_register_target_btg_is_undefined'});
        return;
    }

    Promise.resolve().then(() => {
        return appDao.findPlayerByBtg(device, region, btg);
    }).then((player) => {
        if(player != undefined) {
            res.status(409).json({err: 'target_resource_is_already_exist'})
            return Promise.reject(409);
        }
        return crawlAndSave.onlyCrawlForRegister(device, region, btg);
    }).then((crawlData) => {
        if(Object.keys(crawlData).length === 0 && crawlData.constructor === Object) {
            res.status(400).json({err: 'this_battle_tag_is_invalid_in_overwatch_reason'})
            return Promise.reject(400);
        }
        return saveAll(device, region, btg, crawlData);
    }).then((player) => {
        res.status(200).json({msg : 'register battle tag is success'});
    }).catch((reason) => {
        if(reason == undefined) console.log('reason is undefined');
        if(Number.isInteger(reason)) {
            // nothing to do, res is sended already
        } else {
            console.log(reason); // reason log for server
            res.status(500).json({err : 'internal server error'}); // reason for client;
        }
    });
}

function findByBtg(device, region, btg){
    const Player = require('mongoose').model(`Players_${device}_${region}`); 
    
    return new Promise((resolve, reject) => {
        Player.findOne({ btg : btg }, function(err, player) {
            if(err) {
                reject(err)
                return;
            } 
            resolve(player);
        });
    })
}

function sendPlayer(res, player) {
    if(player == undefined) res.status(404).send('Resource is not exist which you find');
    else res.status(200).send(player);
}

function saveAll(device, region, btg, crawlData){
    return new Promise((resolve, reject) => {
        /* Save Player */
        let promises = [];
        promises.push(appDao.insertPlayer(device, region, getPlayerObj(btg, crawlData)));
        promises.push(appDao.insertCurrentCrawlData(device, region, crawlData));
        promises.push(appDao.insertTodayCrawlData(device, region, crawlData));

        /* All is completed send response */
        //TODO: transaction needed
        //TODO: timeout neeeded
        Promise.all(promises).then(values => {
            resolve();
        }, reason => {
            reject(reason);
        });
    })
}

function getPlayerObj(btg, crawlData) {
    let result = {};
    result.btg = btg;
    result.btn = btg.substring(0, btg.indexOf('-'));
    result.iconUrl = crawlData._meta.iconUrl;
    result.level = crawlData._meta.lowerLevel
    result.cptpt = crawlData._meta.cptpt;

    result.lastUpdateTimeStamp = Date.now();
    result.registerTimeStamp = Date.now();

    return result;
}
