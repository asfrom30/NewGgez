'use strict';

import angular from 'angular';
import './hero.main.css';

export default angular
    .module('hero.component', [])
    .component('hero', {
        controller : HeroMainCtrl,
        template : require('./hero.main.html'),
        bindings : {
            resolvedTierData : '<',
            resolvedPlayer : '<',
            resolvedPlayerData : '<',
        }
    }).name;

export function HeroMainCtrl($document, $window, $state, $stateParams){
    var $ctrl = this;

    $ctrl.$onInit = function(){

        console.log('Check Resolved Data in Hero main');
        console.log($ctrl.resolvedPlayer);
        console.log($ctrl.resolvedPlayerData);
        console.log($ctrl.resolvedTierData);

        $ctrl.id = $stateParams.id;

        /* Move Player from current to players */
        if($ctrl.resolvedPlayer === undefined) {
            $ctrl.currentPlayer = {};
        } else {
            $ctrl.currentPlayer = $ctrl.resolvedPlayer;
            //FIXME: Don't override
            $ctrl.players = {};
            $ctrl.players.id = $ctrl.resolvedPlayer;
        }

        /* Move player data from resolved to current and players */
        if($ctrl.resolvedPlayerData === undefined) {
            $ctrl.currentPlayerData = {};
            $ctrl.currentPlayerData.id = {};
        } else {
            $ctrl.currentPlayerData = {};
            //TODO: make reponse check util
            /* Array to Object Bind */
            for(let playerData of $ctrl.resolvedPlayerData.datas){
                $ctrl.currentPlayerData[playerData.date] = {};
                $ctrl.currentPlayerData[playerData.date].meta = playerData.meta;
                $ctrl.currentPlayerData[playerData.date].data = playerData.data;
            }

            //TODO: undefined check..
            // $ctrl.playerDatas = {};
            // $ctrl.playerDatas.id = $ctrl.resolvedPlayerData.datas;
        }

        /* Move Resolved `tierDatas` to `$ctrl`*/
        if($ctrl.resolvedTierData === undefined) {

        } else {
            $ctrl.tierData = $ctrl.resolvedTierData;
        }
    }

    $ctrl.$onChanges = function(obj) {
        
    }

    $ctrl.moveTab = function(stateName){
    
        let id = $stateParams.id;
        
        switch(stateName) {
            case 'summary' : 
                $state.go('hero.summary', {id:id});
                break;
            case 'detail' : 
                $state.go('hero.detail', {id:id});
                break;
            case 'admin' :
                $state.go('hero.admin', {id:id});
                break;
        }
    }

    $ctrl.onTabClicked = function($event) {
        // let $_targetDom = $event.curren
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


    