'use strict';

/* import bootstrap css */
// require('bootstrap/dist/css/bootstrap.css');

/* import bootstrap js */
require("expose-loader?$!jquery");
require("expose-loader?popper!popper.js");
require('bootstrap/dist/js/bootstrap.min.js');

/* import d3 js */
require("expose-loader?d3!d3");

// import ngAnimate from 'angular-animate';
// import ngTouch from 'angular-touch';

/* Basic Angular */
import angular from 'angular';
// import uiRouter from 'angular-ui-router';
import uiRoute from '@uirouter/angularjs/release/angular-ui-router.js';
import angularTranslate from 'angular-translate';
import ngResource from 'angular-resource';
// import ngCookies from 'angular-cookies';
// import ngSanitize from 'angular-sanitize';
// import 'angular-socket-io';
// import 'angular-validation-match';

/* Call Angular Add on */
import ngInfinteScroll from 'ng-infinite-scroll';

/* import configs */
import i18nConfig from './configs/app.i18n.config';
import { routeConfig } from './configs/app.route.config.js';

/* Constant */
import constants from './app.constants';
/* Common Module */
import CommonsModule from './commons/commons.module';
/* App Core */
import appCore from './core/core.module';
/* Version */
// Declare app level module which depends on views, and components

angular.module('ggezkrApp', [ngResource,
  // ngRoute,
  /* Configs Dependency */
  uiRoute, angularTranslate,
  
  constants,

  /* ng component */
  'infinite-scroll',

  /* Common */
  CommonsModule, appCore,

  // 'myApp.version',
])
.config(routeConfig)
.config(i18nConfig)
.run(function ($rootScope, CONST) {
  'ngInject';
  $rootScope.CONST = CONST;
  $('#indicator-in-index-page').hide();
});;