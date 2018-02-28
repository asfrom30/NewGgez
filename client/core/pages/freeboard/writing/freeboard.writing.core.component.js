'use strict';

import angular from 'angular';

export default angular
    .module('myModule', [])
    .component('freeboardWriting', {
        template : require('./index.html'),
        controller : controller,
    })
    .name;

function controller($state, $element, Freeboard, Noty, CoreUtils) {
    
    const $ctrl = this;
    $ctrl.onSave = onSave;
    $ctrl.onTempPost = onTempPost;

    const NOTY_MSG = {
        WRITING_SUCCESS : 'FREEBOARD_WRITING_SUCCESS',
    }

    function onSave() {
        const title = $ctrl.title;
        const contentLength = getContentMessenger().getLength();
        const valid = isFreeboardValid(title, contentLength);
        
        if(valid) {
            const content = getContentMessenger().getContents();
            Freeboard.save(title, content).$promise.then(result => {
                Noty.show(NOTY_MSG.WRITING_SUCCESS, 'info', 500, function() {
                    return $state.go('freeboard.page', {index : 1});
                })
            }, reason => {
                const errMsg = reason.data.err || 'DEFAULT_ERROR';
                Noty.show(errMsg, 'error');
            });
        }
    }

    function onTempPost() {
        
    }

    /**
     * Getter and Setter
     */
    function getContentMessenger(){
        return $ctrl.contentMessenger;
    }

    /**
     * 
     * @param {*} title 
     * @param {*} contentLength 
     */
    function isFreeboardValid(title, contentLength) {
        let flag = true;
        // valid check
        if(title == null || title == '') {
            Noty.show('TITLE_IS_NULL', 'warning');
            flag = false;
        }
        if(contentLength < 10) {
            Noty.show('CONTENT_TOO_SHORT', 'warning');
            flag = false;
        }
        if(100 < contentLength) {
            Noty.show('CONTENT_TOO_LONG', 'warning');
            flag = false;
        }

        return flag;
    }

}
