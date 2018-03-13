'use strict';

import angular from 'angular';

export default angular
    .module('text.editor.common.component.module', [])
    .component('textEditor', {
        template: require('./index.html'),
        controller: controller,
        bindings: {
            contentMessenger: '=',
            viewMode: '<',
        }
    })
    .name;


function controller() {

}