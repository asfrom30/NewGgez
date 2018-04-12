'use strict';
require('./index.css');

import angular from 'angular';
import FreeboardListModule from './list/freeboard.list.core.component';
import FreeboardWritingModule from './writing/freeboard.writing.core.component';
import FreeboardDetailModule from './detail/freeboard.detail.core.component';

export default angular.module('freeboard.core.pages.module', [FreeboardListModule, FreeboardWritingModule, FreeboardDetailModule])
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
