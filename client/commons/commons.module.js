'use strict';

import angular from 'angular';

require('./common.css');
require('./common-loop-banner.css');
require('./bootstrap-v4-custom.css')

import CommonComponentsModule from './components/components.common.module'
import CommonJqueryWrapModule from './jquery.wrap/jquery.wrap.common.module';
import CommonDirectivesModule from './directives/directives.common.module';
import CommonD3Module from './d3/d3.common.module';
import CommonUtilsModule from './utils/utils.common.module';
import CommonServicesModule from './services/common.services.module';

export default angular
    .module('commons.module', [CommonComponentsModule, CommonDirectivesModule, CommonD3Module, CommonUtilsModule, CommonJqueryWrapModule, CommonServicesModule])
    .name;