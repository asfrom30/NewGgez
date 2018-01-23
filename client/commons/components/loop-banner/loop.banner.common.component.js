require('./index.css');

const angular = require('angular');

export default angular
    .module('loop.banner.common.component.module',[])
    .component('loopBanner', {
        template: require('./index.html'),
        controller : controller,
        bindings : {
            bannerItems : '<'
        }
    })
    .name;


export function controller() {
    const $ctrl = this;
    const logFlag = false;

    $ctrl.$onInit = function() {

    }

    $ctrl.$onChanges = function(onChnages) {

    }


}
