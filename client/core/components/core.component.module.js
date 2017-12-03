'use strict';

import angular from 'angular';


import TestModule from './test/test.module';

import IndexModule from './index/index.component';
import FeatureModule from './feature/feature.module';
import HeroModule from './hero/hero.module';

export default angular
    .module('components.module', [TestModule, FeatureModule, IndexModule, HeroModule])
    .name;