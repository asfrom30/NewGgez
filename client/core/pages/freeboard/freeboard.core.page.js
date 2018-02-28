'use strict';

import angular from 'angular';
import FreeboardPageModule from './page/freeboard.page.core.component';
import FreeboardWritingModule from './writing/freeboard.writing.core.component';
import FreeboardDetailModule from './detail/freeboard.detail.core.component';

export default angular.module('freeboard.core.pages.module', [FreeboardPageModule, FreeboardWritingModule, FreeboardDetailModule])
    .component('freeboard', {
        template : require("./index.html"),
        controller : controller,
    }).name;

export function controller($state){
    'ngInject';
    
    var $ctrl = this;
    const logFlag = false;
    const dom = {
    }

    $ctrl.$onInit = onInit;
    
    function onInit() {
        
    }
}
