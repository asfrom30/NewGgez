'use strict';

import angular from 'angular';
import './hero.selectors.css';

import './style.index.css';

import './style.fixed.header.css';

import './style.hero.selector.css';
import './style.tier.selector.css';


import './style.player.search.bar.css';
import './style.search.table.css';

export default angular
    .module('hero.selectors', [])
    .component('heroSelectors', {
        controller : HeroSelectorsCtrl,
        template : require('./hero.selectors.html'),
        bindings : {
            p1GameLabel : '<',
            p2GameLabel : '<',
            
            tierGameLabel : '<',
            
            heroGameLabelP1 : '<',
            heroGameLabelP2 : '<',

            
            p1Player : '<',
            selected : '=',

            onSelectorChanges : '&',
            changeP2PlayerData : '&',

            storeUserDatas : '&',
            checkUserDatas : '&',

            onTableCompareToggle : '&',
            onTableResultToggle : '&'
        }
    }).name;

const errMsg = {
    err_server_working_is_not_properly : "서버에서 응답하지 않습니다.",
    err_this_battle_tag_is_not_exist_in_server : "해당 배틀태그는 서버에 등록되어 있지 않습니다."
}

export function HeroSelectorsCtrl($scope, $timeout, $element, $stateParams, Ajax, CoreUtils){

    var $ctrl = this;
    const device = $stateParams.device;
    const region = $stateParams.region;

    /* wrap with dom selector */

    $ctrl.$onInit = function(){
        if(process.env.NODE_ENV !== 'production') excutesForDev(true);
        initView(); 
        dataBinding();
    }

    $ctrl.$onChanges = function(changesObj) {

    }

    function initView() {
        hideFixedBottomCollapse();
        hideSearchBar();
        showPlayerSearchIcon();
    }

    $ctrl.hasGame = hasGame;
    function hasGame(number){

        if(isNaN(number) || number == undefined || number ==0) {
            return false;
        } else {
            return true;
        }

    }

    function excutesForDev(flag) {
        if(!flag) return;

        // const p1Index = 'yesterday';
        // const p2Index = 'yesterday';
        // const tierIndex = 'heroic';
        // const heroIndex = 'doomfist';

        const p1Index = 'season';
        const p2Index = 'week';
        const tierIndex = 'diamond';
        const heroIndex = 'mercy';

        $timeout(function(){
            $element.find(`#first-player-${p1Index}-selected`).click();
            $element.find(`#second-player-${p2Index}-selected`).click();
            $element.find(`#${tierIndex}`).click();
            $element.find(`#${heroIndex}`).click();
        }, 300)

        onPlayerSearchBtn('a');
    }

    /* View */
    $ctrl.toggleFixedBottomCollapse = toggleFixedBottomCollapse;
    $ctrl.toggleSearchBar = toggleSearchBar;
    $ctrl.toggleSearchTable = toggleSearchTable;
    $ctrl.onPlayerSearchBtn = onPlayerSearchBtn;

    $ctrl.onSelectorClicked = function($event){

        /* View update add active and remove active*/
        let $_targetDom = $event.currentTarget;
        activeJustOne($_targetDom);

        /* update selected */
        updateSelected();
        /* test */
    }

    $ctrl.onHeroClicked = function($event){
        $element.find(dom.heroSelector).removeClass('active');
        $($event.currentTarget).addClass('active');

        updateSelected();
    }


    /* data binding */
    function dataBinding() {
        if($ctrl.cache == undefined) $ctrl.cache ={};

        $ctrl.cache.p1 = $ctrl.p1Player;
    }

    /* method binding */
    function changeP2PlayerData(id){
        $ctrl.changeP2PlayerData({$id : id});
    }

    /* Controller */
    function onSelectorChanges(selector) {
        $ctrl.onSelectorChanges({$selector : selector});
    }

    function activeJustOne($_targetDom) {
        $element.find($_targetDom).siblings().removeClass('active');
        $element.find($_targetDom).addClass('active');
    }

    /* View */
    function toggleFixedBottomCollapse() {
        hideSearchBar();
        getFixedBottomCollapseDom().slideToggle('fast');
    }
    
    function toggleSearchBar() {
        hideFixedBottomCollapse();
        getFriendSearchDom().slideToggle('fast');
    }

    function hideFixedBottomCollapse() {
        getFixedBottomCollapseDom().slideUp('fast');
    }

    function showFixedBottomCollapse() {
        getFixedBottomCollapseDom().slideDown('fast');
    }

    function hideSearchBar() {
        getFriendSearchDom().slideUp('fast');
    }

    function showSearchBar() {
        getFriendSearchDom().slideDown('fast');
    }

    function showPlayerSearchIcon() {
        $element.find(dom.playerSearchIcon).show();
        $element.find(dom.playerSearchLoader).hide();
    }

    function showPlayerSearchLoader() {
        $element.find(dom.playerSearchLoader).show();
        $element.find(dom.playerSearchIcon).hide();
    }

    function toggleSearchTable() {
        $element.find('search-table').slideToggle('fast');
    }

    

    // TODO: 자기버튼먼 업데이트 되게 할 것.
    function updateSelected() {
        let p1ActiveDomId = getActiveDomIdInSiblings("#first-player-selector button");
        let p2ActiveDomId = getActiveDomIdInSiblings("#second-player-selector button");

        $ctrl.selected = {
            p1Index : getDateIndex("first", p1ActiveDomId),
            p2Index : getDateIndex("second", p2ActiveDomId),
            tierIndex : getTierIndex(),
            heroIndex : getHeroSelected(),
        }

        onSelectorChanges($ctrl.selected);//todo : 항상 업데이트 되는게 아니라, 다른 데이터를 선택했을때 변화가 있게 변경할 것..
    }

    function getDateIndex(playerNum, domId){
        let result;
        switch(domId) {
            case playerNum + "-player-week-selected" :
                result = 'week';
                break;
            case playerNum + "-player-yesterday-selected" :
                result = 'yesterday';
                break;
            case playerNum + "-player-today-selected" :
                result = 'today';
                break;
            case playerNum + "-player-season-selected" :
                result = 'season';
                break;
            case playerNum + "-player-custom-selected" :
                result = CoreUtils.getDateIndex(1);
            default :
                result = undefined;
                break;
        }
        return result;
    }


    function getPlayerSelected(playerNum) {
        let result = "";

        $element.find("#" + playerNum + "-player-selector button")
            .siblings()
            .each(function(){
                if($(this).hasClass('active')) {
                    let id = $(this).attr('id');
                    
                }
            });
        return result;
    }

    function getActiveDomIdInSiblings(domSelector){
        let activeId;
        $element.find(domSelector).siblings().each(function(){
            if($(this).hasClass('active')) {
                activeId = $(this).attr('id');
            } 
        })
        return activeId;
    }

    function getTierIndex() {
        let id = undefined;

        $element.find('#tier-selector button')
            .each(function(){
                if($(this).hasClass('active')){
                    id = $(this).attr('id');
                }
            });
        return id;
    }

    function getHeroSelected() {
        let id = undefined;

        $(dom.heroSelector).each(function(){
            if($(this).hasClass('active')){
                id = $(this).attr('id');
            }
        });

        return id;
    }

    // Searched Player List clicked...
    $ctrl.onClick = function(id) {
        Ajax.fetchPlayerWithId(device, region, id).then(result => {
            setP2DataToHeader(result);
            changeP2PlayerData(id);
        }, reason => {
            if(reason.isServerError) CoreUtils.noty(errMsg.err_server_working_is_not_properly, 'error');
            else CoreUtils.noty(errMsg.err_this_battle_tag_is_not_exist_in_server, 'warning');
        })
    }


    function onPlayerSearchBtn(input) {
        
        if(input == undefined || input.length ==0) return;

        showPlayerSearchLoader();

        const device = $stateParams.device;
        const region = $stateParams.region;
        const index = input.indexOf('#');

        if(index == -1) {
            Ajax.searchPlayer(device, region, input).then(list => {
                showPlayerSearchIcon();

                $ctrl.searchedPlayerList = list;
                $scope.$apply();
            }, reason => {
                showPlayerSearchIcon();

                if(reason.isServerError) CoreUtils.noty(errMsg.err_server_working_is_not_properly, 'error');
                else CoreUtils.noty(errMsg.err_bad_request, 'warning');
            })
        } else {
            input = input.replace("#", "-");

            /* get player from server */
            Ajax.fetchPlayerWithBtg(device, region, input).then(result => {
                showPlayerSearchIcon();

                const id = getIdFromResult(result);
                setP2DataToHeader(result);
                changeP2PlayerData(id);
            }, reason => {
                showPlayerSearchIcon();

                if(reason.isServerError) CoreUtils.noty(errMsg.err_server_working_is_not_properly, 'error');
                else CoreUtils.noty(errMsg.err_this_battle_tag_is_not_exist_in_server, 'warning');
            })
        } 
    }

    function getIdFromResult(result) {
        return result._id;
    }

    function setP2DataToHeader(player) {
        if($ctrl.cache == undefined) $ctrl.cache = {};
        $ctrl.cache.p2 = player;
    }

    /* dom controller */
    const dom = {
        heroSelector : '.hero-one-selector',
        fixedBottomCollapse : '#fixed-bottom-collapse',
        playerSearchBar : '#player-search-bar',
        playerSearchIcon : '#player-search-icon',
        playerSearchLoader : '#player-search-loader',
    }
    
    function getFriendSearchDom(){
        return $element.find(dom.playerSearchBar);
    }

    function getFixedBottomCollapseDom() {
        return $element.find(dom.fixedBottomCollapse);
    }

    /* not yet used */
    function isAlreadyExistInCache(){
        // if($ctrl.checkUserDatas({$id:id})) {
        //     console.log(id + " data is already existed");
        //     return;
        // } 
        return false;
    }


}
