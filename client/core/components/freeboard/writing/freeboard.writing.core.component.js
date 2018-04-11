'use strict';

import angular from 'angular';
// require('./index.css');

export default angular
    .module('myModule', [])
    .component('freeboardWriting', {
        template : require('./index.html'),
        controller : controller,
    })
    .name;

function controller($state, $element, Freeboard, Noty, CoreUtils, rules, LOG_SETTING) {
    
    const $ctrl = this;
    const logFlag = LOG_SETTING.FLAG
    $ctrl.onTempPost = onTempPost;
    $ctrl.onPost = onPost;
    $ctrl.onCancle = onCancle;

    const NOTY_MSG = {
        WRITING_SUCCESS : 'NOTY.FREEBOARD.WRITING_SUCCESS',
        TITLE_IS_NULL : 'NOTY.FREEBOARD.TITLE_IS_NULL',
        TITLE_LONG : 'NOTY.FREEBOARD.TITLE_IS_LONG',
        CONTENT_IS_SHORT : 'NOTY.FREEBOARD.CONTENT_IS_SHORT',
        CONTENT_IS_LONG : 'NOTY.FREEBOARD.CONTENT_IS_LONG',

    }

    /**
     * Event
     */
    function onPost() {

        const title = $ctrl.title;
        const contentLength = getContentMessenger().getLength();
        const valid = isFreeboardValid(title, contentLength);
        
        
        if(valid) {
            const content = getContentMessenger().getContents();
            const text = getContentMessenger().getText();
            Freeboard.save(title, content, text).then(datas => {
                Noty.show(NOTY_MSG.WRITING_SUCCESS, 'info', 500, function() {
                    return $state.go('freeboard.list', {pageIndex : 1});
                });
            }, errors => {
                Noty.show(`SERVER.${errors.msg2Client}`, 'error');
            });
        }
    }

    function onTempPost() {
        
    }

    function onCancle() {
        window.history.back();
    }

    /**
     * Getter and Setter
     */
    function getContentMessenger(){
        return $ctrl.contentMessenger;
    }

    function isFreeboardValid(title, contentLength) {
        // valid check
        if(title == null || title == '') {
            Noty.show(NOTY_MSG.TITLE_IS_NULL, 'warning');
            return false;
        }

        const titleLength = title.length;
        const titleMaxLength = rules.freeboard.title.maxStringLength
        const contentMinLength = rules.freeboard.content.minStringLength;
        const contentMaxLength = rules.freeboard.content.maxSTringLength;

        let flag = true;

        if(titleMaxLength < titleLength) {
            Noty.show(NOTY_MSG.TITLE_LONG, 'warning');
            flag = false;
        }
        if(contentLength < contentMinLength) {
            Noty.show(NOTY_MSG.CONTENT_IS_SHORT, 'warning');
            flag = false;
        }
        if(contentMaxLength < contentLength) {
            Noty.show(NOTY_MSG.CONTENT_IS_LONG, 'warning');
            flag = false;
        }

        return flag;
    }

}
