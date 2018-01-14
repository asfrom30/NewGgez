'use strict';
require('./index.css');
import angular from 'angular';

export default angular
    .module('search.table.core.component.module',[])
    .component('searchTable', {
        template: require('./index.html'),
        controller : ctrl,
        bindings : {
            playerList : '<',
            onClick : '&',
        }
    }).name;

function ctrl ($element) {

    const $ctrl = this;

    $ctrl.$onInit = function() {

    }

    $ctrl.$onChanges = function() {
        if($ctrl.playerList == undefined || $ctrl.playerList.length === 0) {
            hideTable();
        } else {
            showTable();
        }
    }

    function hideTable() {
        $element.find('table').slideUp();
    }

    function showTable() {
        $element.find('table').slideDown();
    }
}