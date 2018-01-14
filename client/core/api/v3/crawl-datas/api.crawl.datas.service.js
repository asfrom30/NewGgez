'use strict';

import angular from 'angular';
import apiConfig from '../../core.api.config';

export default angular
    .module('api.v3.crawl.datas', [])
    .factory('CrawlDatasApi', ['$resource', function($resource){

        let api = `/:device/:region/crawl-datas/:id`;

        const env = process.env.NODE_ENV;
        if(env === 'webpack') api = 'http://localhost:9000' + api;

        return $resource(api, {}, {
            update : {
                method : 'PUT',
                params: {
                    device: "@device",
                    region : "@region",
                    id: "@id"
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
