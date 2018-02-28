'use strict';

import angular from 'angular';
require('./index.css');

export default angular.module('nav.core.component.module', [])
    .component('appNav', {
        template : require("./index.html"),
        controller : controller,
        bindings : {
        }
    }).name;

export function controller(AppLogger, $state, $translate){
    'ngInject';
    
    var $ctrl = this;
    const logFlag = false;

    $ctrl.goRandomPage = goRandomPage;
    $ctrl.goFreeBoard = goFreeBoard;
    $ctrl.changeLang = changeLang;

    function goRandomPage() {
        const id = getRandomId();
        moveHeroPage('pc', 'kr', id);
    }
    
    function moveHeroPage(device, region, id){
        if(device == undefined | region == undefined | id == undefined) {
            if(device == undefined) AppLogger.log('device is undefined, can not go hero page', logFlag, 'error' );
            if(region == undefined) AppLogger.log('device is undefined, can not go hero page', logFlag, 'error');
            if(id == undefined) AppLogger.log('device is undefined, can not go hero page',  logFlag, 'error');
            return;
        }
        const params = {device : device, region : region, id : id};
        $state.go(`hero.summary`, params, {reload: true});
    }

    function getRandomId(){
        const min = 1;
        let max = 13000;
        try {
            max = $ctrl.indexInformation.totalPlayers;
        } catch (error) {
            
        }
        const id = Math.floor((Math.random() * max) + min);

        return id;
    }

    function changeLang(){
        const langKey = $ctrl.tempSelectedLang;
        if(langKey == undefined) alert('need to select lang');
        $translate.use(langKey);
    }

    function goFreeBoard() {
        $state.go(`freeboard`);
    }

}
