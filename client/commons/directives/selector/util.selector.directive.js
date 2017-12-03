'use strict';

import angular from 'angular';

export default angular
    .module('util.selector.directive', [])
    .directive('ngSelector', function(){
        return {
            restrict: 'E',
            templateUrl: 'template.html',
            scope: {
              data: '='
            },
            link: function(scope, element, attrs) {
              switch (scope.data) {
                case 1:
                  scope.options = [1];
                  break;
                case 2:
                  scope.options = [2];
                  break;
                case 3:
                  scope.options = [3];
                  break;
              }
            }
          }
    })