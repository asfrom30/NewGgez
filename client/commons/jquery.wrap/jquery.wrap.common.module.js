'use strict';

import angular from 'angular';

import KnobJQueryWrapModule from './knob/knob.jquery.wrap.common.direcitve';
// import ToolbarJQueryWrapModule from './toolbar/toolbar.jquery.wrap.common.direcitve';
import AnimateNumberWrapModule from './animate-number/animate.number.wrap.common.directive';

export default angular
    .module('jquery.wrap.common.module', [KnobJQueryWrapModule, /* ToolbarJQueryWrapModule */])
    .name;