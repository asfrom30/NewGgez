'use strict';

import angular from 'angular';

export function testMainCtrl ($stateParams, CoreUtils){
    var $ctrl = this;

    var ajaxIndicator = new CoreUtils.ajaxIndicator("Loading dy");

    $ctrl.click = function(){
        
        /* First Way*/
        // new CoreUtils.loadingProgress("Loading dy").show();
        
        /* Second Way*/
        // var loadingProgress = new CoreUtils.loadingProgress("Loading dy");
        // loadingProgress.show();

        ajaxIndicator.show();
    }

    $ctrl.hide = function(){
        ajaxIndicator.hide();
    }
}

export default angular.module('components.test', [])
    .component('test', {
        template : require('./test.main.html'),
        controller : testMainCtrl,
    })
    .name;