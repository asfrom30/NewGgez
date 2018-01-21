'use strict';

import angular from 'angular';

export default angular
    .module('hero.ranking.module', [])
    .component('heroRanking', {
        controller : controller,
        template : require('./index.html'),
        bindings : {

        }
    }).name;

export function controller($scope, $stateParams, $timeout, AppLogger, Ajax){

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
    }
}



