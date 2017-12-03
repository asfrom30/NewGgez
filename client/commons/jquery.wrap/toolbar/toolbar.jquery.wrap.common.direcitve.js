'use strict';

import angular from 'angular';
import './lib/toolbar/paulkinzett-toolbar-fbfde3e/jquery.toolbar.js';   // http://paulkinzett.github.io/toolbar/

export default angular
    .module('jquery.wrap.toolbar', [])
    .directive('toolbarTip', function(){
        return {
            restrict : 'A',
            link: function(scope, element, attrs) {
                $(element).toolbar(scope.$eval(attrs.toolbarTip));
            }
        }
    })
    .name;

