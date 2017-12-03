'use strict';

import angular from 'angular';

export function tutorialCtrl (UserDatas){
    var ctrl = this;
    
    ctrl.$onInit = function(){
        // console.log('fetch data from dummy api....');
        // UserDatas.get({id : 1}, function(res){
        //     // console.log(res);
        //     ctrl.testValue = 'hello';
        // });
    }

    ctrl.fetchData = function(inputId){
        console.log('fetch data from dummy api....');
        UserDatas.get({id : 1}, function(res){
            ctrl.testValue = 'testValue check';

            ctrl.dataset = [
                {
                    label : 'hi',
                    yesterday : 'hello',
                    today : 'dyd',
                },
                {
                    label : 'hi',
                    yesterday : 'hello',
                    today : 'dyd',
                },
                {
                    label : 'hi',
                    yesterday : 'hello',
                    today : 'dyd',
                }
            ]
        });
    }
    

    ctrl.tUpdate = function(){
        console.log('tupdate');
    }

    ctrl.tDelete = function(){
        console.log('tDelete');
    }
}

export default angular.module('components.tutorial', [])
    .component('tutorial', {
        template : require('./tutorial.html'),
        controller : tutorialCtrl,
    })
    .name;