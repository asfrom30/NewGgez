'use strict';

import angular from 'angular';

require('./css/index.css');
require('./css/style.display.info.css');
require('./css/style.player.table.css');

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
    const logFlag = false;
    const dom = {
        searchedPlayerTable : '.player-table-container table',
        noResultPlayerTable : '#no-result-in-searched-player',
        searchDropDownButton : '#search-section .dropdown-menu',
    }
    $ctrl.search = onSearchButton;
    $ctrl.moveHeroPage = moveHeroPage;
    
    $ctrl.$onInit = function() {
        onlyRunPcKr();
        excutesForDev(true);
        initView();
    }

    function onlyRunPcKr() {
        $element.find(dom.searchDropDownButton).hide();
        $ctrl.region = 'kr';
        $ctrl.device = 'pc';
    }

    function excutesForDev(flag) {
        if(flag == false) return;

        const env = process.env.NODE_ENV;
        if(env === 'production') return;

        $ctrl.input = '냅둬라날#3934';

        // $ctrl.search();
        // $('html, body').animate({ scrollTop: 2000 }, 50); 
    }

    /* View */
    function initView() {
        scrollDownAnimateInit();
    }

    function scrollDownAnimateInit() {
        $(function() {
            $('a[href*="#"]').on('click', function(e) {
                e.preventDefault();
                $('html, body').animate({ scrollTop: $($(this).attr('href')).offset().top}, 500, 'linear');
            });
        });
    }

    function hideNoResultPlayerTable() {
        $element.find(dom.noResultPlayerTable).slideUp('fast');
    }
    
    function showNoResultPlayerTable() {
        $element.find(dom.noResultPlayerTable).slideDown('fast');
    }

    function hideSearchedPlayerTable() {
        $element.find(dom.searchedPlayerTable).slideUp('fast');
    }

    function showSearchedPlayerTable() {
        $element.find(dom.searchedPlayerTable).slideDown('fast');
        
    }

    /* Controller */
    function onSearchButton(){
        /* If input is null, nothing to do*/
        const input = $ctrl.input;
        if(input === undefined || input == null || input == '' ) {
            hideSearchedPlayerTable();
            hideNoResultPlayerTable();
            return ;
        }

        /* Check Device, Region, input has # */
        const device = $ctrl.device;
        const region = $ctrl.region;
        
        if(!checkSearchValid(device, region, input)) return;

        if(input.indexOf('#') == -1){
            btnSearch(device, region, input);
        } else {
            const btg = input.replace("#", "-");
            btgSearch(device, region, input, btg);
        }
        
    }

    function btnSearch(device, region, input) {
        Ajax.searchPlayer(device, region, input).then(result => {
            // is Array? if not...
            const length = result.length;
            if(length == undefined || length == 0) {
                hideSearchedPlayerTable();
                showNoResultPlayerTable();
            } else {
                showSearchedPlayerTable();
                hideNoResultPlayerTable();
                $ctrl.searchedPlayerList = result;
                $scope.$apply();
            }
        })
    }   

    function btgSearch(device, region, input, btg) {
        Ajax.fetchPlayerWithBtg(device, region, btg).then(response => {
            if(response._id == undefined) {
                CoreUtils.noty('존재 하지 않는 ID 입니다. 관리자에게 알려주세요. 조치해드리겠습니다.');
                consoel.log('id is undefined');
                return;
            };
            moveHeroPage(device, region, response._id);
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
        Ajax.registerPlayer(device, region, btg).then(player => {
            const id = player._id;
            if(id == undefined) {
                CoreUtils.noty("cant_recieve_app_id", 'error');
            } else {
                // '정상적으로 등록되었습니다. 첫방문을 환영합니다. 잠시후 전적분석 페이지로 이동합니다.'
                CoreUtils.noty("move_page_automatically_in_seconds", 'success');
                moveHeroPage(device, region, id);
            }
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

        return result;
    }

    function notyfyFirstVisit(flag) {
        if(flag) {
            CoreUtils.noty("첫 방문을 환영합니다", "type");
        }
    }

    function moveHeroPage(device, region, id){
        if(device == undefined | region == undefined | id == undefined) {
            if(device == undefined) AppLogger.log('device is undefined, can not go hero page', logFlag, 'error' );
            if(region == undefined) AppLogger.log('device is undefined, can not go hero page', logFlag, 'error');
            if(id == undefined) AppLogger.log('device is undefined, can not go hero page',  logFlag, 'error');
            return;
        }
        // FIXME: Impl service for transfer profile data        
        // bind Current player only battle tag
        // $ctrl.bindCurrentPlayer({$event : {player : player}});
        $window.location.href = `#!/hero/${device}/${region}/${id}/summary`;
    }
}
