'use strict';

import angular from 'angular';
import apiConfig from '../../core.api.config';

export default angular
    .module('api.v3.players', [])
    .factory('PlayersApi', ['$resource', function($resource){
        const api = `${apiConfig.baseUri}/:device/:region/players/:id`

        return $resource(api, {}, {
            get: {
                method: 'GET',
                interceptor: {
                    response: function(response) {      
                        var result = response.resource;        
                        result.$status = response.status;
                        return result;
                    }
                }
            },
            register : {
                method : 'PUT',
            } 
        });
        
    }]).name;
