'use strict';

import angular from 'angular';

export default angular
    .module('api.v3.players.id', [])
    .factory('PlayersIdApi', ['$resource', function($resource){

        var api = 'http://localhost:3000/players/:id'

        return $resource(api, {}, {
            
        })
        
    }]).name;
