'use strict';
require('./index.css');

import angular from 'angular';
import QuillDeltaToHtmlConverter from 'quill-delta-to-html';

export default angular
    .module('quill.render.common.component.module', [])
    .component('quillRender', {
        template: require('./index.html'),
        controller: controller,
        bindings: {
            delta: '<'
        }
    })
    .name;


function controller($element) {

    const $ctrl = this;

    $ctrl.$onChanges = function () {
        if($ctrl.delta == undefined) return;
        const deltaOps = $ctrl.delta.ops;
        const configurations = {};
        const converter = new QuillDeltaToHtmlConverter(deltaOps, configurations);

        const html = converter.convert();
        $element.find('.quill-render-container').html(html);
    }
}
