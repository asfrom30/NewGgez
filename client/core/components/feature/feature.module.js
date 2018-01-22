'use strict';

import angular from 'angular';

import CompareTableModule from './compare-table';
import FeatureRadarChartModule from './feature-radar-chart/feature.radar.chart.component';
import SearchTableModule from './search-table/search.table.core.component'
import UpDownSymbolModule from './up-down-symbol/up.down.symbol.core.feature';

export default angular
    .module('core.components.feature', [SearchTableModule, CompareTableModule, FeatureRadarChartModule, UpDownSymbolModule])
    .name;
