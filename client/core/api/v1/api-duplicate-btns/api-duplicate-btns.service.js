import angular from 'angular';

'use strict';

export default angular
    .module('core.apiDuplicateBtns', [])
    .factory('DuplicateBtns', ['$resource', function($resource){
        
        // var api = 'api/v1/users/?btn=:btn'
        var api = 'dummies/users/:btn.json';

        return $resource(api, {}, {
            /* Custom API */
            query: {
                method: 'GET',
                isArray: true
            }
        });

    }]).name;