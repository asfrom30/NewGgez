'use strict';

import angular from 'angular';

// TODO: If pas param to export from inner... separate code..
// fetchUserDatas : fetchUserDatas
// export function fetchPlayerProfile(id){
//     let promise = new Promise((resolve, reject) => {
        
//     })
//     return promise;
// }

const logScope = 'ajax-service';


//FIXME: must be separated ajax Indicator
export default angular
    .module('core.services.ajax', [])
    .factory('Ajax', function(AppLogger, IndexInformationApi, PlayersApi, CrawlDatasApi , TierDatasApi, CoreUtils, CONFIG){
        return {
            fetchIndexInformation : function() {
                AppLogger.log('Try To fetch Index Information', 'info', logScope);

                return IndexInformationApi.get().$promise.then(json => {
                    const result = {};
                    if (result == undefined) {
                        AppLogger.log('Fetched Index Information is null', 'error', logScope);
                        return result;
                    } 
                    result.totalPlayerNumber = json.total_player_num;
                    result.totalGameNumber = json.total_game_num;
                    return result;
                })
            },
            registerPlayer : function(device, region, btg) {
                let ajaxIndicator = new CoreUtils.ajaxIndicator("Try To Register Battle Tag " + btg);
                ajaxIndicator.show();

                return new Promise((resolve, reject) => {
                    PlayersApi.register({device : device, region : region}, {btg : btg}).$promise.then(response => {
                        AppLogger.log(`server msg : ${response.toJSON().msg}`, 'info', logScope);
                        resolve(response.toJSON().value);
                    }).catch(reason => {
                        AppLogger.log(reason, 'info', logScope);
                        
                        const statusCode = reason.status + ''
                        let result = reason.data;
                        if(statusCode.startsWith('4')) {
                            result.isServerError = false;
                        } else if (statusCode.startsWith('5')){
                            result.isServerError = true;
                        }
                        reject(result);
                    }).then( result => {
                        ajaxIndicator.hide();
                        return result;
                    });
                })
            },
            fetchPlayerWithBtg : function(device, region, btg) {
                AppLogger.log(`Fetch Player(btg : ${btg}) about from server`, 'info', logScope);

                let ajaxIndicator = new CoreUtils.ajaxIndicator(`${btg} 사용자를 검색중입니다.`);
                ajaxIndicator.show();

                return new Promise((resolve, reject) => {
                    PlayersApi.get({device:device, region:region, btg:btg}).$promise.then(response => {
                        AppLogger.log(`server msg : ${response.toJSON().msg}`, 'info', logScope);
                        resolve(response.toJSON().value);
                    }).catch(reason => {
                        AppLogger.log(reason, 'info', logScope);

                        const statusCode = reason.status + ''
                        let result = reason.data;
                        if(statusCode.startsWith('4')) {
                            result.isServerError = false;
                        } else if (statusCode.startsWith('5')){
                            result.isServerError = true;
                        }
                        reject(result);
                    }).then (() => {
                        ajaxIndicator.hide();
                    })
                })
            },
            fetchPlayerWithId : function(device, region, id) {
                AppLogger.log(`Fetch Player (Id :${id}) about from server`, 'info', logScope);

                let ajaxIndicator = new CoreUtils.ajaxIndicator(`사용자(${id})를 검색중입니다.`);
                ajaxIndicator.show();

                return new Promise((resolve, reject) => {
                    PlayersApi.get({device:device, region:region, id:id}).$promise.then(response => {
                        AppLogger.log(`server msg : ${response.toJSON().msg}`, 'info', logScope);
                        resolve(response.toJSON().value);
                    }).catch(reason => {
                        AppLogger.log(reason, 'info', logScope);

                        const statusCode = reason.status + ''
                        let result = reason.data;
                        if(statusCode.startsWith('4')) {
                            result.isServerError = false;
                        } else if (statusCode.startsWith('5')){
                            result.isServerError = true;
                        }
                        reject(result);
                    }).then (() => {
                        ajaxIndicator.hide();
                    })
                })
            },
            // http://localhost:3000/pc/kr/crawl-datas/1/?date=17-10-18,17-10-21,17-10-22,17-10-23
            fetchCrawlDatas : function(device, region, id) {
                AppLogger.log(`Fetch Crawl Data(id : ${id}) about from server`, 'info', logScope);

                let ajaxIndicator = new CoreUtils.ajaxIndicator(`사용자 데이터를 가져오는 중입니다.`);
                ajaxIndicator.show();

                /* Make Defaulat Date Query : yesterday, week, today, current */
                const dates = [CoreUtils.getTodayIndex()
                    , CoreUtils.getCurrentIndex()
                    , CoreUtils.getYesterIndex()
                    , CoreUtils.getWeekIndex()
                ];
                const dateQuery = makeDateQuery(dates);
                
                return new Promise((resolve, reject) => {
                    CrawlDatasApi.get({device:device, region: region, id:id, date:dateQuery}).$promise.then(response => {
                        AppLogger.log(`server msg : ${response.toJSON().msg}`, 'info', logScope);
                        resolve(response.toJSON().value);
                    }).catch(reason => {
                        AppLogger.log(reason, 'info', logScope);
                        
                        const statusCode = reason.status + ''
                        let result = reason.data;
                        if(statusCode.startsWith('4')) {
                            result.isServerError = false;
                        } else if (statusCode.startsWith('5')){
                            result.isServerError = true;
                        }
                        reject(result);
                    }).then(() => {
                        ajaxIndicator.hide();
                    });
                }) 
            },
            fetchCrawlDatasWithDates : function(device, region, id, dates) {
                console.warn('fetch crawl data with dates is not implement yet');
                
                // TODO: Date Valid Check...
                /* TODO: Undefined Check */
                if(dates === undefined) return Promise.reject('date is not defined');
                if(dates.lenght == 0) return Promise.reject('date is not defined');
            },
            fetchTierDatas : function(device, region, date) {
                let ajaxIndicator = new CoreUtils.ajaxIndicator("Try To fetch Tier Data ");
                ajaxIndicator.show();

                return new Promise((resolve, reject) => {
                    TierDatasApi.get({device : device, region : region, date : date}).$promise.then(response => {
                        AppLogger.log(`server msg : ${response.toJSON().msg}`, 'info', logScope);
                        
                        //FIXME: if data is no exist in that date
                        resolve(response.toJSON().value);
                    }).catch(reason => {
                        AppLogger.log(reason, 'info', logScope);
                        
                        const statusCode = reason.status + ''
                        let result = reason.data;
                        if(statusCode.startsWith('4')) {
                            result.isServerError = false;
                        } else if (statusCode.startsWith('5')){
                            result.isServerError = true;
                        }
                        reject(result);
                    }).then( result => {
                        ajaxIndicator.hide();
                        return result;
                    });
                })
            },
            needToOrganize : function () {
                AppLogger.log("Fetch Player Id about " + btg + "from server", 'info', logScope);
                
                let ajaxIndicator = new CoreUtils.ajaxIndicator(`${btg} 사용자를 검색중입니다.`);
                ajaxIndicator.show();
                
                return PlayersApi.get({device:device, region:region, btg:btg}).$promise.then(response => {
                    AppLogger.log(response, 'info', logScope);
                    return {
                        status_code : response.$status,
                        body : response.toJSON()
                    };
                }).catch(reason => {
                    return {
                        status_code : reason.status,
                        body : {},
                    };
                }).then(() => {
                    ajaxIndicator.hide();
                });
            },
        }
    }).name;

/* Parse dates array to comma added string */
function makeDateQuery(dates){
    let result = "";
    for(let date of dates){
        result += date + ","
    }
    return result.substring(0, result.length-1); // remove last comma
}
