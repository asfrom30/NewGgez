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
            addThumb : '&',
            removeThumb : '&',
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

        // init for variables
        if($ctrl.favorites == undefined || !Array.isArray($ctrl.favorites)) $ctrl.favorites = [];
        if($ctrl.thumbs == undefined || !Array.isArray($ctrl.thumbs)) $ctrl.thumbs = [];
    }

    $ctrl.$onChanges = function(changesObj){
        updateFavoriteIcon();
        updateThumbIcon();
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
                $ctrl.addFavorite({$id : id});
            })
        } else {
            Ajax.removeFavorite(device, region, id).then(result => {
                $ctrl.removeFavorite({$id : id});
            })
        }
    }

    function thumbBtnClicked() {
        const thumbs = $ctrl.thumbs;
        console.log(thumbs.indexOf(id));
        if(thumbs.indexOf(id) == -1) {
            Ajax.addThumb(device, region, id).then(result => {
                if(result) {
                    $ctrl.thumbs.push(id);
                    updateThumbIcon();
                }
            }, reason => {
                // noty for user
            })
        } else {
            Ajax.removeThumb(device, region, id).then(result => {
                console.log(result);
                if(result) {
                    const index = thumbs.indexOf(id);
                    thumbs.splice(index, 1);
                    updateThumbIcon();
                }
            })
        }
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

