'use strict';

import angular from 'angular';

export default angular
    .module('api.v3.playerDatas', [])
    .factory('PlayerDatasAPI', ['$resource', function($resource){

        var api = 'http://localhost:3000/player-datas/:id'

        return $resource(api, {}, {
            
        })
        
    }]).name;
