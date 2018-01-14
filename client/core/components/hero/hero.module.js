'use strict';

import angular from 'angular';

import heroMain from './main/hero.main.component';
import heroHeader from './header/hero.header.component';
import heroSummary from './summary/hero.summary.component';
import heroDetail from './detail/hero.detail.component';
import heroSelectors from './selectors/hero.selectors.component';
import heroFavoritesCompModule from './favorites/hero.favorites.component';

export default angular
    .module('hero.module',[heroMain, heroSummary, heroHeader, heroDetail, heroSelectors, heroFavoritesCompModule])
    .name;