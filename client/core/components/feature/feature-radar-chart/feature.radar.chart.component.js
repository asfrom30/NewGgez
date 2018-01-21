'use strict';
require('./feature.radar.chart.css');
import angular from 'angular';

export default angular
    .module('feature.radar.chart',[]) // to be d3.radarChart
    .component('featureRadarChart', {
        template: require('./feature.radar.chart.html'),
        controller : RadarChart,
        bindings : {
            statIndexes : '<',
            labelColumn : '<',
            firstColumn : '<',
            secondColumn : '<',
            thirdColumn : '<',
        }
    }).name;

export function RadarChart($element, $attrs){

    var $ctrl = this;
    
    $ctrl.$onInit = function(){

        /* Set RadarChartOptions */
        let radarChartOptions = {};
        
        // console.log($('hero-detail .first-section').width())
        var margin = {top: 100, right: 30, bottom: 30, left: 30},
            // width = Math.min(700, window.innerWidth - 10) - margin.left - margin.right,
            //FIXME: NOT DEPEND ON JQUERY, DEPEND ON ELEMENT
            width = $('hero-detail .first-section').width() - margin.left - margin.right,
            height = Math.min(width, window.innerHeight - margin.top - margin.bottom - 20);
                
        var color = d3.scale.ordinal()
            .range(["#CC333F", "#CC333F","#00A0B0", "#EDC951"]);
    
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
        const firstColumn = $ctrl.firstColumn;
        const secondColumn = $ctrl.secondColumn;
        const thirdColumn = $ctrl.thirdColumn;

        // if(firstColumn == undefined) // FIXME;
        /* Set Data */
        let dataset = [];
        const statIndexes = $ctrl.statIndexes;
        if(statIndexes == undefined) {
            // show no statIndexes
            // console.warn('no stat Indexes in radar chart');
            $ctrl.dataset = [[], [], [], []];
        } else {
            dataset.push(makeLabelset(statIndexes));
            dataset.push(makeDataset(statIndexes, firstColumn));
            dataset.push(makeDataset(statIndexes, secondColumn));
            dataset.push(makeDataset(statIndexes, thirdColumn));
            $ctrl.dataset = dataset;
        }
    }
}

function makeLabelset(labelColumn) {
    let result = [];

    if(labelColumn == undefined) return [];

    for(let i=0; i < labelColumn.length; i++){
        let axis = (labelColumn[i] == undefined) ? '-' : labelColumn[i];
        result.push({axis : axis, value : 0});
    }
    return result;
}

function makeDataset(statIndexes, dataColumn) {
    let result = [];

    if(dataColumn == undefined) return [];

    for(const statIndex of statIndexes) {
        let value = dataColumn[statIndex];
        result.push({axis : statIndex, value : getColumnPoint(dataColumn, statIndex)});
    }

    return result;
}

function getColumnPoint(column, statIndex) {
    try {
        let result = column[statIndex].point;
        result = parseFloat(result);
        if(isNaN(result)) return 0;
        else return result;
    } catch (error) {
        return undefined;
    }
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



