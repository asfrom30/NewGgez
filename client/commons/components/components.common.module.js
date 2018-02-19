'use strcit';

import angular from 'angular';

import animateNumberModule from './animate-number'
import loopBannerModule from './loop-banner/loop.banner.common.component'

export default angular
    .module('components.common.module', [animateNumberModule, loopBannerModule])
    .name;