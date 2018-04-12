'use strict';
// require('./index.css');

import angular from 'angular';

export default angular.module('freeboard.detail.core.component', [])
    .component('freeboardDetail', {
        template : require("./index.html"),
        controller : controller,
        bindings : {
            freeboard : '<',
        }
    }).name;

function controller(Freeboard, $stateParams, $timeout, $state, $element, Noty, rules, LOG_SETTING) {

    const $ctrl = this;
    const logFlag = LOG_SETTING.FLAG;

    const selectors = {
        commentTextArea : '#comment-textarea',
    }

    const NOTY_MSG = {
        FREEBOARD_DELETE_SUCCESS : 'NOTY.FREEBOARD.DELETE_SUCCESS',
        COMMENT_INVALID : 'NOTY.FREEBOARD_COMMENT.INVALID',
        COMMENT_POST_FAIL : 'NOTY.FREEBOARD_COMMENT.POST_FAIL',
    }

    $ctrl.$onInit = onInit;

    // ajax event
    $ctrl.onPostComment = onPostComment;
    $ctrl.onUpvoteFreeboad = onUpvoteFreeboad;
    $ctrl.onModifyFreeboard = onModifyFreeboard;
    $ctrl.onDeleteFreeboard = onDeleteFreeboard;

    $ctrl.goFreeboardList = goFreeboardList;
    
    // view event
    $ctrl.onWriteComment = onWriteComment;

    /**
     * Event Lifecycle
     */
    function onInit() {
        $timeout(function(){
            $element.find("#first-click").click();
        }, 300)
    }

    /**
     * Route Event
     */
    function goFreeboardList(){
        $state.go('freeboard.list');
    }

    /**
     * Event with Ajax
     */
    function onPostComment() {
        const id = $stateParams.id;
        const comment = $ctrl.comment;

        if(!isValidComment(comment)) return Noty.show(NOTY_MSG.COMMENT_INVALID, 'warning');

        Freeboard.saveComment(id, comment).$promise.then(response => {
            const postedComment = response.toJSON().result;
            $ctrl.freeboard.comments.push(postedComment);
            initCommentModel();
        }).catch(reason => {
            const errMsg = reason.data.err;
            Noty.show(NOTY_MSG.COMMENT_INVALID, 'error');
        }).finally(() => {

        });
    }

    function onUpvoteFreeboad() {
        const id = $stateParams.id;
        Freeboard.upvote(id).$promise.then(response => {
            const result = response.toJSON();
            Noty.show(`NOTY.SERVER.${result.msg}`, 'info');
        }, reason => {
            const statusCode = reason.status;
            const resultJson = reason.data;
            if(logFlag) console.log(statusCode, resultJson.errLog);
            Noty.show(`NOTY.SERVER.${resultJson.errMsg}`, 'warning');
        })
    }

    function onModifyFreeboard() {

    }

    function onDeleteFreeboard() {
        const id = $stateParams.id;
        Freeboard.remove(id).then(datas => {
            Noty.show(NOTY_MSG.FREEBOARD_DELETE_SUCCESS, undefined, 'short', function() {
                return window.history.back();
            })
        }, errors => {
            Noty.show(`SERVER.${errors.msg2Client}`, 'warning');
        })
    };

    /**
     * Event without Ajax(only view change)
     */
    function onWriteComment(){
        const selector = selectors.commentTextArea;

        $('html, body').animate({
            scrollTop: $element.find(selector).offset().top
        }, 500);
    }

    /**
     * init Value
     */
    function initCommentModel() {
        $ctrl.comment = undefined;
    }


    /**
     * Dom handler
     */

    /**
     * 
     */
    function isValidComment(comment) {
        if(comment == undefined) return false;

        const minLength = rules.comment.minStringLength;
        const maxLength = rules.comment.maxStringLength;
        const length = comment.length;

        if(length < minLength) return false;
        if(maxLength < length) return false;

        return true;
    }
}