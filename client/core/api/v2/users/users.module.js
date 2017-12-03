'use strict'

import angular from 'angular';

export default angular
    .module('core.api.users', [])
    .factory('Users', ['$resource', function Users($resource) {
        
            var api = 'dummies/users/:id.json';     // client api
        
            return $resource(api, {}, {
                
            })
    }])
    .name;
