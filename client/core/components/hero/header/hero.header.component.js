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

export function heroHeaderCtrl($stateParams, $state, $rootScope, $scope) {

    var $ctrl = this;
    $ctrl.id = $stateParams.id;

    $ctrl.$onInit = function() {
        // console.log($ctrl.currentPlayer);
    }

    $ctrl.moveTab = function(stateName){
    
        const params = {device : $stateParams.device, region : $stateParams.region, id : $stateParams.id};
        switch(stateName) {
            case 'summary' : 
                $state.go('hero.summary', params);
                break;
            case 'detail' : 
                $state.go('hero.detail', params);
                break;
            case 'admin' :
                $state.go('hero.admin', params);
                break;
        }
    }
}

