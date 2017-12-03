'use strict';

import angular from 'angular';
import 'jquery-knob';   // https://github.com/aterrien/jQuery-Knob

/**
 * Usage
 * <knob ng-model="$ctrl.test"></knob>
 */
export default angular
    .module('jquery.wrap.knob', [])
    .directive('knob', function(){
        return {
            restrict : 'E',
            require: 'ngModel',
            link : function(scope, el, attrs, ngModel) {
                el.knob({
                    fgColor : attrs.fgColor,
                    change : function (value) {
                        scope.$apply(function() {
                            ngModel.$setViewValue(value);
                        })
                    }
                });

                ngModel.$render = function () {
                    el.val(ngModel.$viewValue).trigger('change');
                }
            }
        }
    })
    .name;

