'use stirct';

import angular from 'angular';

import enter from './enter/util.enter.directive';
import selector from './enter/util.enter.directive';

export default angular
    .module('directives.common.module', [enter, selector])
    .name;