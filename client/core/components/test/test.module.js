'use strict';

import angular from 'angular';

import mainModule from './main/test.main.component';
import tutorial from './tutorial/tutorial.component';

export default angular
    .module('hero.test',[mainModule, tutorial])
    .name;