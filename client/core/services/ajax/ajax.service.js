'use strict';

import angular from 'angular';

/** Fetch Player Data Usage */
// var dates = [];
// dates.push('17-10-23');
// dates.push('17-10-24');
// Ajax.fetchPlayerDatas(3, dates)
//     .then(result => {
//         console.log(result);
//     }, reason => {
//         console.log(reason);
//     });

// TODO: If pas param to export from inner... separate code..
// fetchUserDatas : fetchUserDatas
// export function fetchPlayerProfile(id){
//     let promise = new Promise((resolve, reject) => {
        
//     })
//     return promise;
// }

export default angular
    .module('core.services.ajax', [])
    .factory('Ajax', function(PlayersIdApi, PlayerDatasAPI, PlayersBtgApi, UserDatasAPI, TierDatasApi, CoreUtils, CONFIG){
        return {
            fetchTierDatas : function() {
                let ajaxIndicator = new CoreUtils.ajaxIndicator("Try To fetch Tier Data "
            );
                ajaxIndicator.show();

                return TierDatasApi.get().$promise.then(arrResource => {
                    let result = {};
                    for(let resource of arrResource){
                        result[resource._id] = resource;
                    }
                    return result;
                });
            },
            registerPlayer : function(btg) {
                let ajaxIndicator = new CoreUtils.ajaxIndicator("Try To Register Battle Tag " + Btg);
                ajaxIndicator.show();
                
                return PlayersBtgApi.$save({},{btg : btg}).$promise.then(result => {
                    // post process
                    // ajaxIndicator.hide();
                    return result.toJSON();
                });
            },
            fetchPlayerWithBtg : function(btg) {
                let ajaxIndicator = new CoreUtils.ajaxIndicator("Fetch Player Profile Btg is " + btg + "from server");
                ajaxIndicator.show();
                
                return PlayersBtgApi.get({btg : btg}).$promise.then(result => {
                    // post process
                    ajaxIndicator.hide();
                    return result.toJSON();
                });
            },
            // TODO: diff fetchPlayer vs fetchUserDatas
            fetchPlayerWithId : function(id) {
                let ajaxIndicator = new CoreUtils.ajaxIndicator("Fetch Player Profile " + id + "from server");
                ajaxIndicator.show();
                return PlayersIdApi.get({id:id}).$promise
                    .then(result => {
                        // console.log(result.toJSON());
                        ajaxIndicator.hide();
                        return result.toJSON();

                        // @Maybe not needed
                        // var obj = {};
                        // obj[id] = result.toJSON();
                        // return obj;
                    }, reason => {
                        console.log(reason);
                    })
            },
            fetchPlayerDatas : function(id, dates) {
                /* Undefined Check */
                if(dates === undefined) return Promise.reject('date is not defined');
                if(dates.lenght == 0) return Promise.reject('date is not defined');
                // TODO: Date Valid Check...

                /* Parse dates array to comma added string */
                let strDates = "";
                for(let date of dates){
                    strDates += date + ","
                }
                strDates = strDates.substring(0, strDates.length-1);

                // cf) http://localhost:3000/player-datas/1/?date=17-10-18,17-10-21,17-10-22,17-10-23
                let ajaxIndicator = new CoreUtils.ajaxIndicator("Fetch Player Datas " + id + "from server");
                ajaxIndicator.show();

                return PlayerDatasAPI.get({id:id, date:strDates}).$promise
                    .then(result => {
                        // console.log(result.toJSON());
                        ajaxIndicator.hide();
                        var obj = {};
                        return result.toJSON();
                    }, reason => {

                    })
            },
            //TODO: very weird replace with other syntax
            fetchUserDatas : function(id) {
                let ajaxIndicator = new CoreUtils.ajaxIndicator("Fetch UserDatas " + id + "from server");

                return new Promise((resolve, reject) => {
                    ajaxIndicator.show();
                    UserDatasAPI.get({id:id}, function(res){
                        resolve(res);
                    },function(response){
                        // handle 404
                    });
                    setTimeout(reject, CONFIG.AJAX_TIME_OUT, 'Default Time out')
                }).then(result => {
                    var obj = {}
                    obj[id] = result.toJSON();
                    ajaxIndicator.hide();
                    // ajaxIndicator.hide();
                    return obj;
                }, reason => {
                    ajaxIndicator.hide();
                    //TODO: CONST.MSG.ERR
                    new CoreUtils.ajaxIndicator("서버에서 응답하지 않습니다.").show();
                });
            }
        }
    }).name;
