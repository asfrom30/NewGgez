'use strict';

import angular from 'angular';

export default angular.module('freeboard.detail.core.component', [])
    .component('freeboardDetail', {
        template : require("./index.html"),
        controller : controller,
        bindings : {
            freeboard : '<',
        }
    }).name;

function controller(Freeboard, $stateParams, $timeout, $state, Noty) {

    const $ctrl = this;
    $ctrl.$onInit = onInit;
    $ctrl.$onChanges = onChanges;
    $ctrl.clickComment = clickComment;
    $ctrl.modifyFreeboard = modifyFreeboard;

    function onInit() {

    }

    function onChanges() {
        $timeout(function(){
            const contentMessenger = $ctrl.contentMessenger;
            if(contentMessenger == undefined) return;
            const content = $ctrl.freeboard.content;
            contentMessenger.setContents(content);
        });
    }

    function clickComment() {
        const id = $stateParams.id;
        const comment = $ctrl.comment;

        if(!isValidComment(comment)) {
            Noty.show('COMMENT_IS_NOT_VALID', 'warning');
            return;
        }

        Freeboard.saveComment(id, comment).$promise.then(result => {
            $state.go($state.current, {}, {reload: true});
        }).catch(reason => {
            const errMsg = reason.data.err;
            Noty.show(errMsg, 'error');
        }).finally(() => {

        })
    }

    function modifyFreeboard() {

    }

    function isValidComment(comment) {
        return true;

        if(comment == undefined) return false;

        const lenght = comment.lenght;

        return true;
    }
}