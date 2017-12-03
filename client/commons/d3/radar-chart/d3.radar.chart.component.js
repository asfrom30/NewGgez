'use strict';

import angular from 'angular';

import RadarChartRedesign from './lib/radar.chart.redesign';
// TODO: difference?
// import { RadarChartRedesign } from './radar-chart-redesign';

export default angular
    .module('d3.radar.chart.common.components',[]) // to be d3.radarChart
    .component('d3RadarChart', {
        template: require('./d3.radar.chart.html'),
        controller : RadarChart,
        bindings : {
            radarChartOptions : '<',
            redraw : "&",
            dataset : '<',
        }
    }).name;

export function RadarChart($element, $attrs){

    var $ctrl = this;
    
    $ctrl.$onInit = function(){

        if($ctrl.radarChartOptions == undefined) $ctrl.radarChartOptions = getDefaultRadarChartOptions();

        /* The way to change d3 dom <- angular dom */
        /* first */
        // if(d3.select("<.class>") == d3.select($element.find(<.class>)[0]) // true
        /* second */
        // if(d3.select("<#id>") == d3.select($element.find(<#id>) // true

        /* replace angular dom select */
        let targetDom = $element.find(".radar-chart-redesign")[0];
        RadarChartRedesign($element.find(targetDom)[0], $ctrl.dataset, $ctrl.radarChartOptions);
    }

    $ctrl.$onChanges = function(changesObj) {
        let targetDom = $element.find(".radar-chart-redesign")[0];
        RadarChartRedesign($element.find(targetDom)[0], $ctrl.dataset, $ctrl.radarChartOptions);   
    }
}

function getDefaultRadarChartOptions(){

    let radarChartOptions = {};

    var margin = {top: 100, right: 100, bottom: 100, left: 100},
        width = Math.min(700, window.innerWidth - 10) - margin.left - margin.right,
        height = Math.min(width, window.innerHeight - margin.top - margin.bottom - 20);
            
    var color = d3.scale.ordinal()
        .range(["#EDC951","#CC333F","#00A0B0"]);

    radarChartOptions = {
        w: width,
        h: height,
        margin: margin,
        maxValue: 0.5,
        levels: 5,
        roundStrokes: true,
        color: color
    };

    return radarChartOptions;
}

function getDummyDataset(){
    /* dummy data set */
    return [
        [//iPhone
            {axis:"Battery Life",value:1},
            {axis:"Brand",value:1},
            {axis:"Contract Cost",value:0},
            {axis:"Design And Quality",value:1},
            {axis:"Have Internet Connectivity",value:1},
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



