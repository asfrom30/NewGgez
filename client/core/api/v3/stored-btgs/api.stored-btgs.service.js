'use strict';

import angular from 'angular';

export default angular
    .module('api.v3.storedBtgs', [])
    .factory('StoredBtgsAPI', ['$resource', function($resource){

        var api = 'http://localhost:3000/stored-btgs/:btg'
        // var api = './dummies/v3/userdatas/:id.json'; // files in client...

        return $resource(api, {}, {
            'register': { method:'PUT'}
        })
        
    }]).name;
