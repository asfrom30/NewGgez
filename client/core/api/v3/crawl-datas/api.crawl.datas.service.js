'use strict';

import angular from 'angular';
import apiConfig from '../../core.api.config';

export default angular
    .module('api.v3.crawl.datas', [])
    .factory('CrawlDatasApi', ['$resource', function($resource){

        //TODO: need organize... do not set baseUri... just for dummies... dev and deploy is not needed
        const api = `/:device/:region/crawl-datas/:id`
        // const api = `${apiConfig.baseUri}/:device/:region/crawl-datas/:id`

        return $resource(api, {}, {
            
        })
        
    }]).name;
