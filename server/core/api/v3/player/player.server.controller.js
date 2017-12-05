/* app utils */
const momentService = require('../../../services/moment.core.service');

/* External Modules */
// var Crawller = require('../externals/crawller.external.controller');
// const mongoHelperFactory = require('../../common/utils/db/mongo.db.helper.factory');
// const mongoHelper = mongoHelperFactory.getInstance();

exports.findById = function(req, res, next, id) {
    const device = req.device;
    const region = req.region;
    const Player = require('mongoose').model(`Players_${device}_${region}`);

    Player.findOne({
        _id : id
    }, function(err, player) {
        if(err) {
            return next(err);
        } else {
            req.player = player;
            next();
        }
    })
}

exports.idx = function(req, res, next) {
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
    sendPlayer(req.player);
}

exports.register = function(req, res, next) {

    const device = req.device;
    const region = req.region;
    const btg = req.body.btg;

    if(btg == undefined) {
        res.status(404).send({err: 'register_target_btg_is_undefined'})
        return;
    }

    findByBtg(device, region, btg).then(player => {
        if(player != undefined) {
            res.status(409).send({err: 'target_resource_is_already_exist'})
            return;
        };

        crawlAndRefine(btg).then(result => {
            if(Object.keys(result).length === 0 && result.constructor === Object) {
                res.json({response_status : { err : 'this_battle_tag_is_invalid_in_overwatch_reason'}})
            } else {
                register(btg, result)
                    .then(player => {
                        let resObj = {
                            response_status : {},
                            value : player,
                        };
                        res.json(resObj);
                    }, reject =>{
                        //FIXME: ERROR RESPONSE...
                        res.json({});
                    });
            }
        }, reason => {
            console.log(reason);
            res.json({status : 'this_battle_tag_is_invalid_in_overwatch_reason2'});
        }); 
    }).catch(reason=> {
        res.status(500).send('internal server error');
    })
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

function extractPlayerObj(btg, crawlData) {
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

function crawlAndRefine(btg){
    return Crawller.doCrawlAndRefine(btg);
}

function register(btg, result){
    return new Promise((resolve, reject) => {
        /* Save Player */
        let playerObj = extractPlayerObj(btg, result);
        var player = new Player(playerObj);

        /* Promise Chain */
        let promises = [];

        /* Save Players */
        promises.push(player.save());

        /* Save Current */
        promises.push(mongoHelper.insertOnePK('playerdatas-current', btg, result));
        
        /* Save Today player data */
        let targetCollectionName = 'playerdatas-' + momentService.getCollectionDateIndex();
        promises.push(mongoHelper.insertOnePK(targetCollectionName, btg, result));

        /* timeout */
        // var timeoutPromise = new Promise((resolve, reject) => {
        //     setTimeout(resolve, 4000, 'four');
        //   });
        // promises.push(timeoutPromise);

        /* All is completed send response */
        //TODO: transaction needed
        Promise.all(promises)
            .then(values => {
                resolve(player);
            }, reason => {
                reject();
            });
    })
}

