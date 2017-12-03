/* Noy yet separated, I don't know how to separate */
// 'use strict'

// import angular from 'angular';
// import UserDatas from './user-datas.service';

// export default angular
//     .module('core.api.userdatas', [])
//     .factory('UserDatas', UserDatas)
//     .name;


import angular from 'angular';

export default angular
    .module('core.api.userdatas', [])
    .factory('UserDatas', ['$resource', function UserDatas($resource) {
        
            var api = 'dummies/userdatas/:id/:date.json';     // client api
            // var api = 'api/v1/userdatas/:id';   // server api
        
            return $resource(api, {id : '@id'}, {
                
                query : {
                    isArray : false
                }
            })
    }])
    .name;
