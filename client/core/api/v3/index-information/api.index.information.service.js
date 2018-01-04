'use strict';

import angular from 'angular';
import apiConfig from '../../core.api.config';

export default angular
    .module('api.v3.indexInformation', [])
    .factory('IndexInformationApi', ['$resource', function($resource){

        let api = `/index-information/1.json`;
        
        /* if need dummie, not yet impl server */
        const env = process.env.NODE_ENV;
        if(env === 'webpack') api = apiConfig.baseUri + api;
        console.log(api);
        return $resource(api, {}, {})
        
    }]).name;
