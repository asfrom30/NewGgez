import angular from 'angular';

'use strict'

export default angular
    .module('core.fetchUserData', [])
    .factory('UserData', ['$resource', function($resource){

        var api = 'dummies/userdatas/:id.json';     // client api
        // var api = 'api/v1/userdatas/:id';   // server api

        return $resource(api, {id : '@id'}, {
            
            /* Custom API to Server */
            // query : {method : 'GET'}
            // charge: {method:'POST', params:{charge:true}}
        })


    }]).name;