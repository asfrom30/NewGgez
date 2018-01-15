'use strict';

import angular from 'angular';
import apiConfig from '../../core.api.config';

export default angular
    .module('api.v3.thumbs', [])
    .factory('ThumbsApi', ['$resource', function($resource){

        let api = `/:device/:region/sessions/thumbs`;

        const env = process.env.NODE_ENV;
        if(env === 'webpack') api = 'http://localhost:9000' + api;

        return $resource(api, {}, {
            get : {
                method : 'GET',
                params: {
                    device: "@device",
                    region : "@region",
                },
                interceptor: {
                    response: function(response) {      
                        var result = response.resource;        
                        result.$status = response.status;
                        return result;
                    }
                }
            },
            add : {
                method : 'PUT',
                params: {
                    device: "@device",
                    region : "@region",
                    id : "@id",
                },
                interceptor: {
                    response: function(response) {      
                        var result = response.resource;        
                        result.$status = response.status;
                        return result;
                    }
                }
            },
            remove : {
                method : 'DELETE',
                params: {
                    device: "@device",
                    region : "@region",
                    id : "@id",
                },
                interceptor: {
                    response: function(response) {      
                        var result = response.resource;        
                        result.$status = response.status;
                        return result;
                    }
                }
            }
        })
        
    }]).name;
