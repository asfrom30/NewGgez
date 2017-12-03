'use strict';

import angular from 'angular';
// import { RadarChartRedesign } from './radar-chart-redesign';

import RadarChartRedesign from './radar-chart-redesign';

export default angular
    .module('feature.radar.chart',[]) // to be d3.radarChart
    .component('featureRadarChart', {
        template: require('./feature.radar.chart.html'),
        controller : RadarChart,
        bindings : {
            labelColumn : '<',
            firstColumn : '<',
            secondColumn : '<',
            thirdColumn : '<',
            // draw : '&',
            // testFunction : '&',
            // testValue : '=',
            // fieldValue : '<', // `<` symbol denotes one-way bindings
            // filedType : '@?', // = two-way binding, @ one-way
            // onUpdate : '&'
        }
    }).name;

export function RadarChart($element, $attrs){

    var $ctrl = this;
    
    $ctrl.$onInit = function(){

        /* Set RadarChartOptions */
        let radarChartOptions = {};
        
        var margin = {top: 10, right: 10, bottom: 10, left: 10},
            width = Math.min(700, window.innerWidth - 10) - margin.left - margin.right,
            height = Math.min(width, window.innerHeight - margin.top - margin.bottom - 20);
                
        var color = d3.scale.ordinal()
            .range(["#CC333F","#00A0B0", "#EDC951"]);
    
        radarChartOptions = {
            w: width,
            h: height,
            margin: margin,
            maxValue: 1,
            levels: 5,
            roundStrokes: true,
            color: color
        };

        $ctrl.radarChartOptions = radarChartOptions;
    }

    $ctrl.$onChanges = function(changesObj){
        /* Set Data */
        let dataset = [];
        dataset.push(makeDataset($ctrl.labelColumn, $ctrl.firstColumn));
        dataset.push(makeDataset($ctrl.labelColumn, $ctrl.secondColumn));
        dataset.push(makeDataset($ctrl.labelColumn, $ctrl.thirdColumn));

        $ctrl.dataset = dataset;
    }
}

function makeDataset(labelColumn, dataColumn) {
    let result = [];

    if(dataColumn == undefined) return [];

    for(let i=0; i < labelColumn.length; i++){
        let axis = (labelColumn[i] == undefined) ? '-' : labelColumn[i];
        
        let value = 0;
        if(dataColumn[i] != undefined) {
            value = (dataColumn[i].point == undefined || isNaN(dataColumn[i].point) ) ? 0 : dataColumn[i].point ;
        }
        result.push({axis : axis, value : value});
    }
    return result;
}

function getDummyDataSet() {
    /* Data Structure */
    return [
        [//iPhone
            {axis:"Battery Life",value:0.22},
            {axis:"Brand",value:0.28},
            {axis:"Contract Cost",value:0.29},
            {axis:"Design And Quality",value:0.17},
            {axis:"Have Internet Connectivity",value:0.22},
            {axis:"Large Screen",value:0.02},
            {axis:"Price Of Device",value:0.21},
            {axis:"To Be A Smartphone",value:0.50}			
        ],[//Samsung
            {axis:"Battery Life",value:0.27},
            {axis:"Brand",value:0.16},
            {axis:"Contract Cost",value:0.35},
            {axis:"Design And Quality",value:0.13},
            {axis:"Have Internet Connectivity",value:0.20},
            {axis:"Large Screen",value:0.13},
            {axis:"Price Of Device",value:0.35},
            {axis:"To Be A Smartphone",value:0.38}
        ],[//Nokia Smartphone
            {axis:"Battery Life",value:0.26},
            {axis:"Brand",value:0.10},
            {axis:"Contract Cost",value:0.30},
            {axis:"Design And Quality",value:0.14},
            {axis:"Have Internet Connectivity",value:0.22},
            {axis:"Large Screen",value:0.04},
            {axis:"Price Of Device",value:0.41},
            {axis:"To Be A Smartphone",value:0.30}
        ]
    ]
}



