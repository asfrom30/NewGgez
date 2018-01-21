'use strict';

import angular from 'angular';

import heroMain from './main/hero.main.component';
import heroHeader from './header/hero.header.component';
import heroSummary from './summary/hero.summary.component';
import heroDetail from './detail/hero.detail.component';
import heroSelectors from './selectors/hero.selectors.component';
import heroFavorites from './favorites/hero.favorites.component';
import heroInsights from './insights/hero.insights.component';
import heroRanking from './ranking/hero.ranking.component';

export default angular
    .module('hero.module',[heroMain, heroSummary, heroHeader, heroDetail, heroSelectors, heroFavorites, heroRanking, heroInsights])
    .name;