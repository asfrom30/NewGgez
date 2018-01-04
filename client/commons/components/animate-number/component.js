require('./index.css');
require('./animate-number-0.0.14/jquery.animateNumber');

const angular = require('angular');

export default angular
    .module('animate.number.common.component.module',[])
    .component('animateNumber', {
        template: require('./index.html'),
        controller : controller,
        bindings : {
            hasComma : '<',
            number : '<',
            time : '<',
        }
    })
    .name;


export function controller($element) {
    const $ctrl = this;

    $ctrl.$onChanges = function() {
        if($ctrl.hasComma) $ctrl.commaSeparator = $.animateNumber.numberStepFactories.separator(',');

        $element.find("#target").animateNumber({
            number : $ctrl.number,
            numberStep : $ctrl.commaSeparator,
        }, $ctrl.time);
    }

}
