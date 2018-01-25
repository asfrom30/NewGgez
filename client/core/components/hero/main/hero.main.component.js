'use strict';

import angular from 'angular';
import './hero.main.css';

const logFlag = false;

export default angular
    .module('hero.component', [])
    .component('hero', {
        controller : HeroMainCtrl,
        template : require('./hero.main.html'),
        bindings : {
            resolvedFavorites : '<',
            resolvedThumbs : '<',
            resolvedPlayer : '<',
            resolvedTierData : '<',
            resolvedCrawlDatas : '<',
        }
    }).name;

export function HeroMainCtrl($document, $window, $state, $stateParams, $scope, AppLogger, CoreUtils){
    var $ctrl = this;

    $ctrl.$onInit = function(){
        AppLogger.log($ctrl.resolvedPlayer, logFlag, 'info');
        AppLogger.log($ctrl.resolvedCrawlDatas, logFlag, 'info');
        AppLogger.log($ctrl.resolvedTierData, logFlag, 'info');

        $ctrl.device = $stateParams.device;
        $ctrl.region = $stateParams.region;
        $ctrl.id = $stateParams.id;

        if(!checkDataIsExist()) {
            //FIXME: IF Current Data is null.. noty and move index page
            // If not try to get data again
            return;
        }

        /* Move Player from current to players */
        if($ctrl.resolvedPlayer === undefined) {
            $ctrl.currentPlayer = {};
        } else {
            $ctrl.currentPlayer = $ctrl.resolvedPlayer;
            
            if($ctrl.currentPlayer.deprecated) {
                CoreUtils.noty('해당 사용자는 만료된 사용자입니다', 'error');
            }
                
            //FIXME: Don't override
            $ctrl.players = {};
            $ctrl.players.id = $ctrl.resolvedPlayer;
        }

        /* Move Resolved `tierDatas` to `$ctrl`*/
        if($ctrl.resolvedTierData === undefined) {

        } else {
            $ctrl.tierData = $ctrl.resolvedTierData;
        }
    }

    $ctrl.$onChanges = function(obj) {
        
    }

    $ctrl.onTabClicked = function($event) {
        // let $_targetDom = $event.curren
    }

    $ctrl.addFavorite = addFavorite;
    $ctrl.removeFavorite = removeFavorite;
    $ctrl.addThumb = addThumb;
    $ctrl.removeThumb = removeThumb;

    function checkDataIsExist() {
        return true;
    }

    function hideNavBar(){
        // TODO: hide navbar when scroll down
        // FIXME: must be replaced with angularjs way
        // https://stackoverflow.com/questions/13549216/changing-css-on-scrolling-angular-style
        $document.on('scroll', function() {
            // do your things like logging the Y-axis
            
            // console.log($window.scrollY);
        
            // or pass this to the scope
            // $scope.$apply(function() {
            //     $scope.pixelsScrolled = $window.scrollY;
            // })
        });
    }

    function addFavorite(id) {
        if(!Array.isArray($ctrl.resolvedFavorites)) {
            $ctrl.resolvedFavorites = [];
        }
        
        id = parseInt(id);
        const resolvedFavorites = $ctrl.resolvedFavorites;
        const index = resolvedFavorites.indexOf(id);

        if(index == -1) {
            // for firing $onchanges
            const newFavorites = resolvedFavorites.slice();
            newFavorites.push(id);
            $ctrl.resolvedFavorites = newFavorites;
        }
        $scope.$apply();
    }

    function removeFavorite(id) {
        let resolvedFavorites = $ctrl.resolvedFavorites;
        id = parseInt(id);
        if(!Array.isArray(resolvedFavorites) || resolvedFavorites.length == 0) {
            resolvedFavorites = [];
        } else {
            const index = resolvedFavorites.indexOf(id);
            if(index == -1){
                // nothing to do
            } else {
                resolvedFavorites.splice(index, 1);
            }
        }
        const newFavorites = resolvedFavorites.slice();
        $ctrl.resolvedFavorites = newFavorites;
        $scope.$apply();
    }

    function addThumb(id) {
        if(!Array.isArray($ctrl.resolvedThumbs)) {
            $ctrl.resolvedFavorites = [];
        }
        
        id = parseInt(id);
        const resolvedThumbs = $ctrl.resolvedThumbs;
        const index = resolvedThumbs.indexOf(id);

        if(index == -1) {
            const newThumbs = resolvedThumbs.slice();
            newThumbs.push(id);
            $ctrl.resolvedThumbs = newThumbs;
        }
        $scope.$apply();
    }

    function removeThumb(id) {
        let resolvedThumbs = $ctrl.resolvedThumbs;
        id = parseInt(id);
        
        if(!Array.isArray(resolvedThumbs) || resolvedThumbs.length == 0) {
            resolvedThumbs = [];
        } else {
            const index = resolvedThumbs.indexOf(id);
            if(index == -1){
                // nothing to do
            } else {
                resolvedThumbs.splice(index, 1);
            }
        }
        const newThumbs = resolvedThumbs.slice();
        $ctrl.resolvedFavorites = newThumbs;
        $scope.$apply();
    }
}


    