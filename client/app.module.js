'use strict';

import './index.html';

/* bootstrap */
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

/* Basic Angular */
import angular from 'angular';
import uiRoute from '@uirouter/angularjs/release/angular-ui-router.js';

// import ngAnimate from 'angular-animate';
// import ngCookies from 'angular-cookies';
import ngResource from 'angular-resource';
// import ngSanitize from 'angular-sanitize';

// import 'angular-socket-io';

// import uiRouter from 'angular-ui-router';
// import uiBootstrap from 'angular-ui-bootstrap';
// import 'angular-validation-match';

/* Route Config */
import { routeConfig } from './app.route.config.js';
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
  uiRoute,
  
  constants,

  /* Common */
  CommonsModule,

  appCore,

  // 'myApp.version',
])
.config(routeConfig)
.run(function ($rootScope, CONST) {
  'ngInject';
  $rootScope.CONST = CONST;
});;