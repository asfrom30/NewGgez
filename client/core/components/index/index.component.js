'use strict';

import angular from 'angular';

export default angular.module('components.index', [])
    .component('index', {
        template : require("./index.html"),
        controller : indexCtrl,
        bindings : {
            currentPlayer : "=",
            // bindCurrentPlayer : "&",
        }
    }).name;

export function indexCtrl($window, $rootScope, $scope, Ajax, UserDatasAPI, CoreUtils){
    'ngInject';
    
    var $ctrl = this;
    $ctrl.search = search;
    $ctrl.moveHeroPage = moveHeroPage;

    function search(){
        var input = $ctrl.input;

        /* If input is null, nothing to do*/
        if(input === undefined || input == null || input == '' ) {
            return ;
        }

        if(input.indexOf('#') == -1){
            // Ajax Live Search...
        } else {
            let btg = input.replace("#", "-");
            battleTagSearch(btg);
        }
    }

    function liveSearch(){
        console.log('live search');
    }

    function battleTagSearch(btg){
        Ajax.fetchPlayerWithBtg(btg)
            .then(player => {
                // Player is not registered in Database, in that case you've got {} object
                if(Object.keys(player).length === 0 && player.constructor === Object) {
                    // try to register btg again(async)
                    return promise = registerBattleTag(btg);
                } else {
                    return player;
                    // resolve immeddiatley
                    // promise = Promise.resolve(player);
                }
            })
            .then(player => {
                if(Object.keys(player).length === 0 && player.constructor === Object) {
                    CoreUtils.noty("해당 배틀태그는 유효하지 않습니다. 확인 바랍니다.", "type");
                } else {
                    // moveHeroPage(player.id);
                    notyfyFirstVisit(player.isFirstVisit);
                    moveHeroPage(player);
                }
            }, reject => {
                CoreUtils.noty("서버에서 응답하지 않습니다.", "type");
            })
    }

    //TODO: NEED : JAVASCRIPT PATTERN.. CALLBACK MUST BE DECLARED IN PARAMS...
    //function registerBattleTag(btg, callback-result, callbakc-reason)
    // because above `.then` metho.. 
    function registerBattleTag(btg) {
        return new Promise((resolve, reject) => {
            StoredBtgsAPI.register({btg:btg}, {}).$promise.then(result=>{
                resolve(result.toJSON());
            }, reason => {
                reject(reason);
            })
        });
    }

    $ctrl.test = function(){
        moveHeroPage(1);
    }

    function notyfyFirstVisit(flag) {
        if(flag) {
            CoreUtils.noty("첫 방문을 환영합니다", "type");
        }
    }

    function moveHeroPage(player){

        if(player._id === undefined) {
            console.log("ID invalid, Cannot go hero page...");
            return;
        }

        //FIXME: bind Current player only battle tag
        // $ctrl.bindCurrentPlayer({$event : {player : player}});
        
        $window.location.href = "#!/hero/summary/" + player._id;
    }
}
