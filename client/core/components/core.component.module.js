'use strict';

import angular from 'angular';


import AppNavModule from './app-nav/app.nav.core.component';
import IndexModule from './index/index.component';
import FeatureModule from './feature/feature.module';
import HeroModule from './hero/hero.module';
import FreeboardModule from './freeboard/freeboard.core.component';

export default angular
    .module('components.module', [FeatureModule, IndexModule, HeroModule, AppNavModule, FreeboardModule])
    .name;