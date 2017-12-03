'use strict';

import angular from 'angular';

export default angular
    .module('api.v3.userdatas', [])
    .factory('UserDatasAPI', ['$resource', function($resource){

        var api = './dummies/v3/userdatas/:id.json'; // client
        // var api = './dummies/v3/userdatas/:id/?date'; // server

        return $resource(api, {}, {

        })
        
    }]).name;
