import anuglar from 'angular';
import './hero.header.css';

'use strict'

export default angular
    .module('ggez.heroHeader', [])
    .component('heroHeader', {
        template : require('./hero.header.html'),
        controller : heroHeaderCtrl,
        bindings : {
            currentPlayer : "<",
        }
    }).name;

export function heroHeaderCtrl($window, $location, $stateParams, $state, $rootScope, $scope, $element) {

    const $ctrl = this;
    const device = $stateParams.device;
    const region = $stateParams.region;

    const dom = {
        summaryNavTab : '#nav-tab-summary',
        detailNavTab : '#nav-tab-detail',
        compareNavTab : '#nav-tab-compare',
        rankNavTab : '#nav-tab-rank',
        favoriteNavTab : '#nav-tab-favorite',
        adminNavTab : '#nav-tab-admin',
    }

    $ctrl.id = $stateParams.id;
    $ctrl.goRandomPage = goRandomPage;

    $ctrl.$onInit = function() {
        const mode = getMode();
        setActiveTab(mode);
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
                $state.go('hero.favorite', params);
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
            case 'favorite' : 
                return dom.favoriteNavTab;
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

