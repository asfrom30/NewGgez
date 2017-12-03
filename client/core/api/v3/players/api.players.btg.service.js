'use strict';

import angular from 'angular';

export default angular
    .module('api.v3.players.btg', [])
    .factory('PlayersBtgApi', ['$resource', function($resource){

        var api = 'http://localhost:3000/players/btg/:btg';

        return $resource(api, {}, {});
        
    }]).name;
