'use strict';

/* expose global variable */
require("expose-loader?$!jquery");
require("expose-loader?$!popper.js");

/* Using bootstrap */
require('bootstrap/dist/css/bootstrap.css');
require('bootstrap/dist/js/bootstrap.min.js');
/* use ui-bootstrap */
// need bootstrap css
// import uiBootStrap from 'angular1-ui-bootstrap4';
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

  /* Common */
  CommonsModule,

  appCore,

  // 'myApp.version',
])
.config(routeConfig)
.config(i18nConfig)
.run(function ($rootScope, CONST) {
  'ngInject';
  $rootScope.CONST = CONST;
  $('#indicator-in-index-page').hide();
});;