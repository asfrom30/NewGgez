'use strict';

import angular from 'angular';
import './styles/layout.css';
import './styles/style.css';

import './hero.selectors.css';

import './style.fixed.header.css';

import './style.hero.selector.css';

import './style.player.search.bar.css';
import './style.search.table.css';

export default angular
    .module('hero.selectors', [])
    .component('heroSelectors', {
        controller : HeroSelectorsCtrl,
        template : require('./hero.selectors.html'),
        bindings : {
            mode : '<',
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

export function HeroSelectorsCtrl($scope, $timeout, $element, $stateParams, Ajax, CoreUtils, $filter){

    var $ctrl = this;
    const device = $stateParams.device;
    const region = $stateParams.region;

    /* wrap with dom selector */
    
    $ctrl.hasGame = hasGame;
    $ctrl.$onInit = function(){
        initView(); 
        dataBinding();
        // initButtonClick();

        if(process.env.NODE_ENV !== 'production') excutesForDev(false);
    };

    $ctrl.$onChanges = function(changesObj) {

    }

    function initView() {
        
        // showFixedBottomCollapse();
        hideFixedBottomCollapse();
        // hideSearchBar();
        // showPlayerSearchIcon();

        const mode = $ctrl.mode;
        if(mode == 'detail') {
            $element.find('.mode-detail').show();
            $element.find('.mode-compare').hide();
        } else if(mode == 'compare') {
            $element.find('.mode-detail').hide();
            $element.find('.mode-compare').show();
        } 
    }

    
    function hasGame(number){

        if(isNaN(number) || number == undefined || number ==0) {
            return false;
        } else {
            return true;
        }

    }

    function initButtonClick() {
        const mode =$ctrl.mode;

        console.log($ctrl.heroGameLabelP1);
        
        const heroIndex = 'mercy';

        $timeout(function(){
            if(mode == 'detail') {
                $element.find(`#p0-week-selected`).click();
            } else if (mode == 'compare') {
                $element.find(`#p1-season-selected`).click();
                $element.find(`#p2-season-selected`).click();
            }

            const tierIndex = $filter('tierIndexFilter')($ctrl.p1Player.cptpt);
            if(tierIndex != undefined) $element.find(`#${tierIndex}`).click();
            $element.find(`#${heroIndex}`).click();
        }, 100)
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
        const heroIndex = 'soldier76';

        $timeout(function(){
            $element.find(`#p1-${p1Index}-selected`).click();
            $element.find(`#p2-${p2Index}-selected`).click();
            $element.find(`#${tierIndex}`).click();
            $element.find(`#${heroIndex}`).click();
            $ctrl.onSearchBarBtn();
        }, 300)

        onPlayerSearchBtn('a');
    }

    /* View */
    $ctrl.onHeroSelectorsBtn = onHeroSelectorsBtn;
    $ctrl.onSearchBarBtn = onSearchBarBtn;
    $ctrl.toggleSearchTable = toggleSearchTable;
    $ctrl.onPlayerSearchBtn = onPlayerSearchBtn;

    
    $ctrl.onSelectorClicked = function($event){

        /* View update add active and remove active*/
        let $_targetDom = $event.currentTarget;
        activeJustOne($_targetDom);

        /* update selected */
        updateSelected();
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
    function onHeroSelectorsBtn() {
        hideSearchBar();
        getFixedBottomCollapseDom().slideToggle('fast');
    }
    
    function onSearchBarBtn() {
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

    function showSearchResultTable() {
        $element.find('search-table').slideDown('fast');
    }

    
    // TODO: 자기버튼먼 업데이트 되게 할 것.
    function updateSelected() {
        const mode = $ctrl.mode;

        let p1Index, p2Index;

        if(mode == 'detail') {
            let p0ActiveDomId = getActiveDomIdInSiblings("#p0-selector button");
            p1Index = getDateIndex("p0", p0ActiveDomId);
            p2Index = 'season';
        } else if (mode == 'compare')  {
            let p1ActiveDomId = getActiveDomIdInSiblings("#p1-selector button");
            let p2ActiveDomId = getActiveDomIdInSiblings("#p2-selector button");
            p1Index = getDateIndex("p1", p1ActiveDomId);
            p2Index = getDateIndex("p2", p2ActiveDomId);
        }
        
        $ctrl.selected = {
            p1Index : p1Index,
            p2Index : p2Index,
            tierIndex : getTierIndex(),
            heroIndex : getHeroSelected(),
        }

        onSelectorChanges($ctrl.selected);
    }

    function getDateIndex(playerNum, domId){
        let result;
        switch(domId) {
            case playerNum + "-week-selected" :
                result = 'week';
                break;
            case playerNum + "-yesterday-selected" :
                result = 'yesterday';
                break;
            case playerNum + "-today-selected" :
                result = 'today';
                break;
            case playerNum + "-season-selected" :
                result = 'season';
                break;
            case playerNum + "-custom-selected" :
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

        showSearchResultTable();
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
