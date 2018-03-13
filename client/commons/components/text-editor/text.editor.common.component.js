'use strict';

require('./index.css');
require('quill/dist/quill.snow.css')

import angular from 'angular';
import Quill from 'quill';

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


function controller($element, $scope) {
    const $ctrl = this;

    $ctrl.$onInit = onInit;


    $ctrl.$onChanges = function () {

    }

    function onInit() {

        const viewMode = $ctrl.viewMode || false;
        
        let toolbar = [];
        if(!viewMode) {
            toolbar = [
                [{ header: [1, 3, 5, false] }],
                ['bold', 'italic', 'underline'],
                ['image', 'code-block'],
            ]
        }


        // quill needs a container
        const container = $element.find('.editor-container')[0];
        var quill = new Quill(container, {
            modules: {
                toolbar: toolbar,
            },
            placeholder: 'Compose an epic...',
            theme: 'snow'  // or 'bubble'
        });

        if(viewMode) quill.enable(false);

        $ctrl.contentMessenger = quill;
    }
}
