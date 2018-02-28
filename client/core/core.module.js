'use strict';

import angular from 'angular'

require('./core.css');

import CorePages from './pages/core.pages.module';
import CoreComponent from './components/core.component.module';
import CoreApi from './api/core.api.module';
import CoreUtils from './utils/core.utils.module';

/* Core Services */
import Services from './services/core.services.module';
/* Core Filters */
import Filters from './filters/core.filters.module';

export default angular
    .module('ggez.core', [CorePages, CoreApi, CoreUtils, Services, Filters, CoreComponent])
    .name;