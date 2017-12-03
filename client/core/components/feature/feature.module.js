'use strict';

import angular from 'angular';

import CompareTableModule from './compare-table/compare.table.component';
import FeatureRadarChartModule from './feature-radar-chart/feature.radar.chart.component';

export default angular
    .module('core.components.feature', [CompareTableModule, FeatureRadarChartModule])
    .name;
