'use strict';

import angular from 'angular';
import AjaxModule from './ajax/ajax.service';
import AnalyzerModule from './analyzer/analyzer.service';
import IndexerModule from './indexer/indexer.service';
import NotyModule from './noty/noty.core.service';

export default angular
    .module('core.services', [AjaxModule, AnalyzerModule, IndexerModule, NotyModule])
    .name;