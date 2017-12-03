'use strict';

import './d3.tester.html'
import angular from 'angular';
import * as d3 from 'd3';

export function D3Tester($scope, $element, $attrs) {
    
    // angular.element(document).find('h4').addClass('border');
    var ctrl = this;
    ctrl.ctrlStyle = "border";
    ctrl.bool = true;

    $scope.scopeStyle = "border";

    // var dataset = [1,4,5];

    // d3.select("body").selectAll("p")
    //     .data(dataset)
    //     .enter()
    //     .append("p")
    //     .text(function(d){
    //         return d;
    //     })
    
    /* Deprecated Code */
    // var ctrl = this;
    // ctrl.editMode = false;

    // ctrl.handleModeChange = function(){
    //     if(ctrl.editMode){
    //         ctrl.onUpdate1({value: ctrl.fieldValue});
    //         ctrl.fieldValueCopy = ctrl.fieldValue;
    //     }
    //     ctrl.editMode = !ctrl.editMode;
    // };

    // ctrl.reset = function() {
    //     ctrl.fieldValue = ctrl.fieldValueCopy;
    // };

    // ctrl.$onInit = function() {
    //     ctrl.fieldValueCopy = ctrl.fieldValue;

    //     if(!ctrl.filedType) {
    //         ctrl.filedType = 'text';
    //     }
    // }

}

export default angular
    .module('d3.tester', [])
    .component('d3Tester', {
        // templateUrl : function(THINGS_D3_COMPONENT){
        //     return THINGS_D3_COMPONENT + 'radar-chart/radar-chart.html'
        // },
        template: require('./d3.tester.html'),
        // templateUrl : './components/d3/tester/d3.tester.html',
        controller : D3Tester,
    }).name;


    