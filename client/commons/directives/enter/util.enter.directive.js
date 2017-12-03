import angular from 'angular';

'use strict';

export default angular
    .module('utils.enter', [])
    .directive('ngEnter', NgEnter)
    .name;

export function NgEnter(){
    return function(scope, element, attrs){
        element.bind('keydown keypress', function(event){
            if(event.which === 13) {
                scope.$apply(function(){
                    scope.$eval(attrs.ngEnter);
                });
                event.preventDefault();
            }
        })
    }
}