'use strict';

import angular from 'angular';
import './hero.selectors.style.css';
import './hero.selectors.layout.css';

// Memo : JQUEYR get event id `$event.currentTarget.id`;
// Memo2 : 
// $element.find($event.currentTarget).siblings().removeClass('active');
// $element.find($event.currentTarget).addClass('active');

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
        }
    }).name;

const errMsg = {
    err_server_working_is_not_properly : "서버에서 응답하지 않습니다.",
    err_this_battle_tag_is_not_exist_in_server : "해당 배틀태그는 서버에 등록되어 있지 않습니다."
}

export function HeroSelectorsCtrl($scope, $element, $stateParams, Ajax, CoreUtils){

    var $ctrl = this;

    /* wrap with dom selector */
    const dom = {
        heroSelector : '.hero-selector'
    }

    $ctrl.$onInit = function(){
        const selector = getDefaultSelector();
        onSelectorChanges(selector);
        dataBinding();
    }

    $ctrl.$onChanges = function(changesObj) {

    }

    /* View */
    $ctrl.toggleSearchFriend = toggleSearchFriend;

    $ctrl.onSearchFriend = onSearchFriend;
    $ctrl.onPlayerClicked = onPlayerClicked;

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


    function onPlayerClicked(id) {
        if(id == undefined) {
            console.warn('id is undefined. can not excutes on Player clicked');
            return;
        }

        changeP2PlayerData(id);
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

    /* View */
    function toggleSearchFriend() {
        console.log('working');
        getFriendSearchDom().toggle('fast');
    }

    /* Controller */
    function onSelectorChanges(selector) {
        $ctrl.onSelectorChanges({$selector : selector});
    }

    function getDefaultSelector() {
        return {
            p1Index : 'today',
            p2Index : 'season',
            tierIndex : 'heroic',
            heroIndex : 'tracer',
        }
    }

    function activeJustOne($_targetDom) {
        $element.find($_targetDom).siblings().removeClass('active');
        $element.find($_targetDom).addClass('active');
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

        $(".hero-selector").each(function(){
            if($(this).hasClass('active')){
                id = $(this).attr('id');
            }
        });

        return id;
    }


    /* not yet used */
    function onSearchFriend(input) {
        input = 'AcQua#3218';

        const index = input.indexOf('#');
        if(index == -1) {
            alert('#을 포함해서 배틀태그를 정확히 입력해주십시오');
        } else {
            input = input.replace("#", "-");
        } 

        /* If data is already existed, not request again. */
        const exist = isAlreadyExistInCache();

        if(exist) {
            // get data from cache
        } else {
            /* get player from server */
            const device = $stateParams.device;
            const region = $stateParams.region;
            Ajax.fetchPlayerWithBtg(device, region, input).then(result => {
                const id = getIdFromResult(result);
                setP2DataToHeader(result);
                changeP2PlayerData(id);
            }, reason => {
                if(reason.isServerError) CoreUtils.noty(errMsg.err_server_working_is_not_properly, 'error');
                else CoreUtils.noty(errMsg.err_this_battle_tag_is_not_exist_in_server, 'warning');
            })
        }
    }

    function getFriendSearchDom(){
        return $element.find('#search-friend-bar');
    }

    function isAlreadyExistInCache(){
        // if($ctrl.checkUserDatas({$id:id})) {
        //     console.log(id + " data is already existed");
        //     return;
        // } 
        return false;
    }

    function getIdFromResult(result) {
        return result._id;
    }

    function setP2DataToHeader(player) {
        if($ctrl.cache == undefined) $ctrl.cache = {};
        $ctrl.cache.p2 = player;
    }


}
