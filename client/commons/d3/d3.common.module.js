'use strcit';


import angular from 'angular';

import * as d3 from 'd3';

import D3tester from './tester/d3.tester.component';
import D3RadarChartModule from './radar-chart/d3.radar.chart.component';
import D3TableChartModule from './table-chart/table-chart.component';

export default angular
    .module('d3.common.module', [D3tester, D3RadarChartModule, D3TableChartModule])
    .name;