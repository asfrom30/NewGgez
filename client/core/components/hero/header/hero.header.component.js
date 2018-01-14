import anuglar from 'angular';
import './hero.header.css';

'use strict'

export default angular
    .module('ggez.heroHeader', [])
    .component('heroHeader', {
        template : require('./hero.header.html'),
        controller : heroHeaderCtrl,
        bindings : {
            favorites : "<",
            addFavorite : '&',
            removeFavorite : '&',
            thumbs : "<",
            currentPlayer : "<",
        }
    })
    .name;

export function heroHeaderCtrl($window, $location, $stateParams, $state, $rootScope, $scope, $element, Ajax) {

    const $ctrl = this;
    const device = $stateParams.device;
    const region = $stateParams.region;
    const id = parseInt($stateParams.id);

    const dom = {
        summaryNavTab : '#nav-tab-summary',
        detailNavTab : '#nav-tab-detail',
        compareNavTab : '#nav-tab-compare',
        rankNavTab : '#nav-tab-rank',
        favoritesNavTab : '#nav-tab-favorites',
        adminNavTab : '#nav-tab-admin',
        refreshIcon : '.refresh > i',
        favoriteIcon : '.favorite > i',
        thumbIcon : '.thumb > i',
    }

    $ctrl.goRandomPage = goRandomPage;
    $ctrl.refreshBtnClicked = refreshBtnClicked;
    $ctrl.starBtnClicked = starBtnClicked;
    $ctrl.thumbBtnClicked = thumbBtnClicked;

    $ctrl.$onInit = function() {
        const mode = getMode();
        setActiveTab(mode);
        updateThumbIcon();
    }

    $ctrl.$onChanges = function(changesObj){
        // console.log($ctrl.favorites);
        console.log('on changes compelte');
        updateFavoriteIcon();
    }

    function refreshBtnClicked() {
        activeRefreshIcon(true);
        Ajax.updateCurrentCrawlData(device, region, id).then(responseJson => {
            // update all.. or refresh?
            console.log('finish');
            activeRefreshIcon(false);
        }).catch(reason => {
            console.log(reason);
        });
    }

    function starBtnClicked() {
        const favorites = $ctrl.favorites;
        if(favorites.indexOf(id) == -1) {
            Ajax.addFavorite(device, region, id).then(result => {
                // if(result) activeFavoriteIcon(true);
                // $ctrl.favorites.push(id);
                $ctrl.addFavorite({$id : id});
            })
        } else {
            Ajax.removeFavorite(device, region, id).then(result => {
                // if(result) activeFavoriteIcon(false);
                // const index = $ctrl.favorites.indexOf(id);
                // if(index != -1) $ctrl.favorites.splice(index, 1);
                $ctrl.removeFavorite({$id : id});
            })
        }
    }

    function thumbBtnClicked() {
        $ctrl.flag = !$ctrl.flag;
        activeThumbIcon($ctrl.flag);


    }

    function updateFavoriteIcon() {
        const favorites = $ctrl.favorites;
        if(favorites.indexOf(id) == -1){
            activeFavoriteIcon(false);
        } else {
            activeFavoriteIcon(true);
        }
    }

    function updateThumbIcon() {
        return;
        const thumbs = $ctrl.thumbs;
        if(thumbs.indexOf(id) == -1){
            activeThumbIcon(false);
        } else {
            activeThumbIcon(true);
        }
    }

    function activeRefreshIcon(flag) {
        const element = $element.find(dom.refreshIcon);
        if(flag){
            element.addClass('active');
        } else {
            element.removeClass('active');
        }
    }

    function activeThumbIcon(flag) {
        const element = $element.find(dom.thumbIcon);
        if(flag){
            element.addClass('active');
        } else {
            element.removeClass('active');
        }
    }

    function activeFavoriteIcon(flag){
        const element = $element.find(dom.favoriteIcon);
        if(flag){
            element.addClass('active');
            element.text('star');
        } else {
            element.removeClass('active');
            element.text('star_border');
        }
    }

    $ctrl.moveTab = function(stateName){
    
        const params = {device : $stateParams.device, region : $stateParams.region, id : $stateParams.id};
        switch(stateName) {
            case 'summary' : 
                $state.go('hero.summary', params);
                break;
            case 'detail' : 
                $state.go('hero.detail', params);
                break;
            case 'compare' : 
                $state.go('hero.compare', params);
                break;
            case 'rank' : 
                $state.go('hero.rank', params);
                break;
            case 'favorite' : 
                $state.go('hero.favorites', params);
                break;
            case 'admin' :
                $state.go('hero.admin', params);
                break;
        }
    }

    function getNavTabSelector(mode){
        switch(mode) {
            case 'summary' :
                return dom.summaryNavTab;
            case 'detail' :
                return dom.detailNavTab
            case 'compare' : 
                return dom.compareNavTab;
            case 'rank' : 
                return dom.rankNavTab;
            case 'favorites' : 
                return dom.favoritesNavTab;
            case 'admin' :
                return dom.adminNavTab;
        }
    }

    function setActiveTab(mode) {
        const $_selector = getNavTabSelector(mode);
        $element.find($_selector).siblings().removeClass('active');
        $element.find($_selector + ' > a').addClass('active');
    }

    function getMode(){
        const path = $location.path();
        const index = path.lastIndexOf('/');
        const mode = path.substring(index + 1).trim();
        return mode;
    }

    function goRandomPage() {
        const max = 13676;
        const min = 1;
        const id = Math.floor((Math.random() * max) + min);
        // console.log(id);
        // $location.path('/hero/${device}/${region}/${id}/summary'); // will redirect you to 'yourDomain.xx/home'
        // $window.location.href = `http://localhost:3000/#!/hero/${device}/${region}/${id}/summary`;

        //FIXME: need to study. apply move page with transition smoothly..
        const params = {device : device, region : region, id : id};
        $state.go('hero.summary', params);
        $state.reload();
    }
}

