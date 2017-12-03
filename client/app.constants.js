'use strict';

import angular from 'angular';

/* Old version */
import Const from './const/constants';
import STATMAP from './const/statmap/statmap.const';
import CONFIG from './const/config/const.config';

/* New Version */
import constants from './const/constants';

export default angular.module('ggezkrApp.constants', [])
    .constant('THINGS_ROOT', '/path/to/this/thing/')
    .constant('THINGS_PARTIALS', '/path/to/this/thing/partials/')
    .constant('THINGS_SUB', '/path/to/this/thing/sub/')
    .constant('THINGS_COMPONENT', '/components/')
    .constant('THINGS_D3_COMPONENT', '/components/d3/')
    .constant('THINGS_VIEWS', '/views/')

    // App Setting Constant
    .constant('STATMAP', STATMAP)
    .constant('CONFIG', CONFIG)

    /* Must be replaced with CONST_LABEL, CONST_RESOURCE*/
    .constant('CONST', Const)

    /* Config */
    .constant('CONFIG_LOG', constants.config.log)
    /* Standards */

    /* Labels */
    .constant('LABEL_SUMMARY_PAGE', constants.label.summaryPageLabel)

    /* New version of constant */
    .constant('CONST_RESOURCE', constants.RESOURCE)
    .constant('CONST_HERO_MAP', constants.HERO_MAP)
    .constant('CONST_DIFF_GAMES_MAP', constants.DIFF_GAMES_MAP)
    .name;

// (function (){
//     var module = angular.module('ggezkrApp');
//     module.paths = {
//         root: '/path/to/this/thing/',
//         partials: '/path/to/this/thing/partials/',
//         sub: '/path/to/this/thing/sub/',
//         components : '/components/',
//         d3Components : '/components/d3/',
//         views : '/views/'
//     };
// })();
