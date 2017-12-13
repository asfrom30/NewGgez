'use strict';

import angular from 'angular';
import './index.css';

const logScope = 'index-component';

export default angular.module('components.index', [])
    .component('index', {
        template : require("./index.html"),
        controller : indexCtrl,
        bindings : {
            currentPlayer : "=",
            indexInformation : '<'
            // bindCurrentPlayer : "&",
        }
    }).name;

export function indexCtrl(AppLogger, $window, $element, $rootScope, $scope, Ajax, CoreUtils){
    'ngInject';
    
    var $ctrl = this;
    $ctrl.search = search;
    $ctrl.moveHeroPage = moveHeroPage;

    $ctrl.moveHeroPage = moveHeroPage;

    $ctrl.$onInit = function() {
        initView();
    }


    /**
     * Functions
     */

    /* View */
    function initView() {
        scrollDownAnimateInit();
        startAnimateNumber();
        appendDevElement();
    }

    function scrollDownAnimateInit() {
        $(function() {
            $('a[href*="#"]').on('click', function(e) {
                e.preventDefault();
                $('html, body').animate({ scrollTop: $($(this).attr('href')).offset().top}, 500, 'linear');
            });
        });
    }

    function startAnimateNumber(){
        console.log($ctrl.indexInformation);
        if($ctrl.indexInformation == undefined) { AppLogger.log('$ctrl.indexInformation is undefined'); return;}
        if($ctrl.indexInformation.totalGameNumber == undefined) { AppLogger.log('totalGameNumber is undefined'); return;}
        if($ctrl.indexInformation.totalPlayerNumber == undefined) { AppLogger.log('totalGameNumber is undefined'); return;}
        $element.find('#total-player-num').text($ctrl.indexInformation.totalGameNumber);
        $element.find('#total-game-num').text($ctrl.indexInformation.totalPlayerNumber);
    }

    function appendDevElement() {
        // how to use angular transclude for
        const node_env = process.env.NODE_ENV;
        if(node_env == 'development') {
            // $(document.body).append('<h1>hi {{$ctrl.input}}</h1>');
        }
    }

    function updateRegion(region){
        
    }

    function updateDevice(device){

    }



    /* Controller */
    function search(){
        /* If input is null, nothing to do*/
        const input = $ctrl.input;
        if(input === undefined || input == null || input == '' ) {
            return ;
        }

        /* Check Device, Region, input has # */
        const device = $ctrl.device;
        const region = $ctrl.region;
        
        if(!checkSearchValid(device, region, input)) return;

        const btg = input.replace("#", "-");

        Ajax.fetchPlayerWithBtg(device, region, btg).then(response => {
            console.log('move hero page with ' + device + ', ' + region + ', ' + response._id);
            // moveHeroPage(device, region, id);
        }, reason => {
            if(reason.isServerError) {
                CoreUtils.noty("서버에서 응답하지 않습니다.", "type");
            } else {
                /* if battle tag is not in server try to register */
                registerPlayer(device, region, btg);
            }
        })
    }

    // 1512627845944.0

    function registerPlayer(device, region, btg) {
        Ajax.registerPlayer(device, region, btg).then(response => {
            console.log('move hero page with ' + device + ', ' + region + ', ' + response._id);
            // moveHeroPage(device, region, id);
        }, reason => {
            if(reason.isServerError) {
                CoreUtils.noty("서버에서 뭔가 이상합니다. 죄송합니다 코드를 발로 짰습니다. ㅠㅠ", "type");
            } else {
                CoreUtils.noty(reason.err, "type");
            }
        });
    }

    function liveSearch(){
        console.log('live search');
    }

    function checkSearchValid(device, region, input){
        let result = true;

        if(device == undefined | region == undefined) {
            if(device == undefined) CoreUtils.noty("Device가 설정되어 있지 않습니다.", "type");
            if(region == undefined) CoreUtils.noty("Region이 설정되어 있지 않습니다.", "type");
            result = false;
        }

        if(input.indexOf('#') == -1){
            CoreUtils.noty("#을 포함해서 정확하게 입력하여 주세요", "type");
            result = false;
        }
        return result;
    }

    function notyfyFirstVisit(flag) {
        if(flag) {
            CoreUtils.noty("첫 방문을 환영합니다", "type");
        }
    }

    function moveHeroPage(device, region, id){
        if(device == undefined | region == undefined | id == undefined) {
            if(device == undefined) AppLogger.log('device is undefined, can not go hero page', 'error', logScope);
            if(region == undefined) AppLogger.log('device is undefined, can not go hero page', 'error', logScope);
            if(id == undefined) AppLogger.log('device is undefined, can not go hero page', 'error', logScope);
            return;
        }
        // FIXME: Impl service for transfer profile data        
        // bind Current player only battle tag
        // $ctrl.bindCurrentPlayer({$event : {player : player}});
        $window.location.href = `#!/hero/summary/${device}/${region}`;
    }

    $ctrl.test = function(){
        $ctrl.input = '냅둬라날#3934';
        $ctrl.region = 'kr';
        $ctrl.device = 'pc';
        search();
    }

    $ctrl.test1 = function(){
        $ctrl.input = '냅둬라날#39341';
        $ctrl.region = 'kr';
        $ctrl.device = 'pc';
        search();
    }

    $ctrl.test2 = function() {
        const device = 'pc';
        const region = 'kr';
        const id = 1;

        let dates = [];
        dates.push('171104');
        dates.push('171105');
        dates.push('171106');
        dates.push('171212');
        dates.push('current');
        // dates.push(CoreUtils.getTodayIndex());
        // dates.push(CoreUtils.getYesterIndex());
        Ajax.fetchCrawlDatas(device, region, id, dates).then(result => {
            console.log(result);
        }, reason => {
            console.log(reason);
        });

    }
}
