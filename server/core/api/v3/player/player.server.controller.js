/* app utils */
const momentService = require('../../../services/moment.core.service');

/* External Modules */
// var Crawller = require('../externals/crawller.external.controller');
// const mongoHelperFactory = require('../../common/utils/db/mongo.db.helper.factory');
// const mongoHelper = mongoHelperFactory.getInstance();

exports.findByBtg = function(req, res, next, btg) {
    const device = req.device;
    const region = req.region;
    const Player = require('mongoose').model(`Players_${device}_${region}`); 

    Player.findOne({
        btg : btg
    }, function(err, player) {
        if(err) {
            return next(err);
        } else {
            req.player = player;
            next();
        }
    })
}

exports.read = function(req, res, next) {
    if(req.player == undefined) {
        res.send({key : 'this player is null'});
    } else {
        res.send(req.player);
    }
}

exports.register = function(req, res, next) {
    
    if(req.body.btg === undefined) {
        res.send({response_status : {err : 'btg_is_undefined'}});
        return;
    }

    let btg = req.body.btg;

    Player.findOne({ btg : btg }, function(err, player) {
        if(err) {
            return next(err);
        } else {
            if(player != null) {
                let resObj = {response_status : {warn : btg + ' is already registered'}};
                resObj.value = player;
                res.status(202).send(resObj);
            } else {
                crawlAndRefine(btg)
                    .then(result => {
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
            }
        }
    })
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

