'use strict';

import angular from 'angular';
import apiConfig from '../../core.api.config';

export default angular
    .module('api.v3.crawl.datas', [])
    .factory('CrawlDatasApi', ['$resource', function($resource){

        const api = `${apiConfig.baseUri}/:device/:region/crawl-datas/:id`

        return $resource(api, {}, {
            
        })
        
    }]).name;
