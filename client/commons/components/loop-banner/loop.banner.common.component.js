require('./styles/index.css');
require('./styles/anim.css')

const angular = require('angular');


// TODO: If you want to use more than two items. you must fix animation css.

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


export function controller($element) {
    const $ctrl = this;
    const logFlag = false;

    $ctrl.$onInit = function() {
        $ctrl.bannerItems = [
            '> <strong>베타</strong> 서비스 중입니다. ',
            '> <strong>모이라</strong> 가 추가 되었습니다.',
            // '> 배틀태그는 <strong>대소문자</strong> 를 정확히 입력해주세요',
        ]

        initManipulateDom();
    }

    $ctrl.$onChanges = function(onChnages) {

    }

    /** View **/
    function initManipulateDom() {
        const doms = $ctrl.bannerItems;
        for(let dom of doms) {
            $element.find('.rl-loop-container').append(`<div class="ticker-item">${dom}</div>`)
        }
    }

}
