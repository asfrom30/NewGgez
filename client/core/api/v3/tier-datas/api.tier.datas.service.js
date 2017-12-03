'use strict';

import angular from 'angular';

export default angular
    .module('api.v3.tierDatas', [])
    .factory('TierDatasApi', ['$resource', function($resource){

        var api = 'http://localhost:3000/tier-datas'

        return $resource(api, {}, {
            get : {
                isArray : true,
            }
        })
        
    }]).name;
