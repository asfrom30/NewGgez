
//FIXME: Need to move controller folder...
const mongoose = require('mongoose');


/* App Moudle */
const appDaoCtrl = require('./controller/dao/dao.crawl.server.controller');

/* App Util */
const utils = require('../common/utils/common.utils');

/* Conver `Player Data` to `Player` all */
//FIXME: Memory usage increases..
exports.convert = function() {
    var Player = require('mongoose').model('Player');
    appDaoCtrl.findAllPlayerDatas('pc_kr_web', 'playerdatas-17-11-07')
        .then(playerdatas => {
            for(let playerdata of playerdatas) {
            // for(let i=0; i < 10; i++) {
                // let playerdata = playerdatas[i];
                let btg = playerdata._id;
                let btn = btg.substring(0, btg.indexOf('-'));;

                /* meta parsing */
                let deprecated = true;
                let iconUrl;
                let cptpt;
                let level;
                let lastUpdateTimeStamp;
                let registerTimeStamp;
                
                if(playerdata._meta !== undefined) {
                    deprecated = false;
                    iconUrl = playerdata._meta.iconUrl;
                    // let level = playerdata._meta.lowerLevel;
                    cptpt = playerdata._meta.cptpt;
                    lastUpdateTimeStamp = playerdata._meta.crawlTimeStamp;
                    // let registerTimeStamp;
                } 
                
                var player = new Player({
                    btg : btg,
                    btn : btn,
                    deprecated : deprecated,
                    iconUrl : iconUrl,
                    cptpt : cptpt,
                    level : level,
                    lastUpdateTimeStamp : lastUpdateTimeStamp,
                    registerTimeStamp : registerTimeStamp
                });
                player.save(function(err){
                    if(err) {
                        utils.log('error in ' + btg , 'red');
                    } else {
                        utils.log('success in ' + btg , 'white');
                    }
                });
            }
        })
}