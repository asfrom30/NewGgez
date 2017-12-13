'use strict';

import angular from 'angular';
import apiConfig from '../../core.api.config';

export default angular
    .module('api.v3.tierDatas', [])
    .factory('TierDatasApi', ['$resource', function($resource){

        const api = `${apiConfig.baseUri}/:device/:region/tier-datas/:date`;
        return $resource(api, {}, {})
        
    }]).name;
