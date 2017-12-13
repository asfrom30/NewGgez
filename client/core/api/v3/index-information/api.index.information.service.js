'use strict';

import angular from 'angular';
import apiConfig from '../../core.api.config';

export default angular
    .module('api.v3.indexInformation', [])
    .factory('IndexInformationApi', ['$resource', function($resource){

        var api = `${apiConfig.baseUri}/index-information/1.json`;

        return $resource(api, {}, {})
        
    }]).name;
