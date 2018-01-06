'use strict';

import angular from 'angular';
import './hero.main.css';

const logScope = 'hero-main';

export default angular
    .module('hero.component', [])
    .component('hero', {
        controller : HeroMainCtrl,
        template : require('./hero.main.html'),
        bindings : {
            resolvedPlayer : '<',
            resolvedTierData : '<',
            resolvedCrawlDatas : '<',
        }
    }).name;

export function HeroMainCtrl($document, $window, $state, $stateParams, AppLogger){
    var $ctrl = this;

    $ctrl.$onInit = function(){
        AppLogger.log($ctrl.resolvedPlayer, 'info', logScope);
        AppLogger.log($ctrl.resolvedCrawlDatas, 'info', logScope);
        AppLogger.log($ctrl.resolvedTierData, 'info', logScope);

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
            if($ctrl.currentPlayer.deprecated) alert('해당 사용자는 만료된 사용자입니다');
            //FIXME: Don't override
            $ctrl.players = {};
            $ctrl.players.id = $ctrl.resolvedPlayer;
        }

        transferResolvedCrawlDatasToCurrentPlayerDatas();

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

    function checkDataIsExist() {
        return true;
    }

    function transferResolvedCrawlDatasToCurrentPlayerDatas() {
        /* currentPlayerData Format */
        // $ctrl.currentPlayerData = {
        //     171213 : {meta : {}, data : {}},
        //     171214 : {meta : {}, data : {}}
        // };

        /* Move player data from resolved to current and players */
        if($ctrl.resolvedCrawlDatas == undefined) {
            $ctrl.currentPlayerData = {};
            $ctrl.currentPlayerData.id = {};
            return;
        }

        $ctrl.currentPlayerData = {};
        for(let playerData of $ctrl.resolvedCrawlDatas){
            $ctrl.currentPlayerData[playerData.date] = {};
            $ctrl.currentPlayerData[playerData.date].meta = playerData.meta;
            $ctrl.currentPlayerData[playerData.date].data = playerData.data;
        }
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
}


    