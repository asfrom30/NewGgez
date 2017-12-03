import anuglar from 'angular';
import './hero.header.css';

'use strict'

export default angular
    .module('ggez.heroHeader', [])
    .component('heroHeader', {
        template : require('./hero.header.html'),
        controller : heroHeaderCtrl,
        bindings : {
            currentPlayer : "<",
        }
    }).name;

export function heroHeaderCtrl($stateParams, $rootScope, $scope) {

    var $ctrl = this;
    $ctrl.id = $stateParams.id;

    $ctrl.$onInit = function() {
        // console.log($ctrl.currentPlayer);
    }
}

