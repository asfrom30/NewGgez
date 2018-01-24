'use strict';

import angular from 'angular';
require('./styles/layout.css');
require('./styles/style.css');

export default angular
    .module('hero.favorites', [])
    .component('heroFavorites', {
        controller : heroFavoriteCtrl,
        template : require('./index.html'),
        bindings : {
            favorites : '<'
        }
    }).name;

export function heroFavoriteCtrl($scope, $stateParams, $timeout, AppLogger, Ajax){

    /* constants */
    const logFlag = false;
    const $ctrl = this;
    const region = $stateParams.region;
    const device = $stateParams.device;
    const stateParams = {device : $stateParams.device, region : $stateParams.region, id : $stateParams.id};
    const dom = {
    }
    

    $ctrl.$onInit = onInit;
    $ctrl.$onChanges = onChanges;

    function onInit() {
        
    }

    function onChanges() {
        loadPlayers();
    }

    function loadPlayers() {
        const favorites = $ctrl.favorites;

        if(!Array.isArray(favorites) || favorites.length == 0) {
            if(!Array.isArray(favorites)) AppLogger.log('err_favorites_is_not_array_can_not_load_player', logFlag, 'error');
            else AppLogger.log('err_favorites_legnth_is_zero', logFlag, 'info');
            
            $ctrl.playerList = [];
        } else {
            const arrIds = favorites;
            Ajax.fetchPlayerWithIds(device, region, arrIds).then(players => {

                // handling deprecated user.
                $ctrl.playerList = players;
                $scope.$apply();
            })
        }
    }


}



