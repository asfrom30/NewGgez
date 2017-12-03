'use strict'

export function UserDatas($resource) {

    return function(){
        'ngInject';
        
            var api = 'dummies/userdatas/:id/:date.json';     // client api
            // var api = 'api/v1/userdatas/:id';   // server api
        
            return $resource(api, {}, {
                /* Custom API to Server */
                query : {
                    method : 'GET',
                    isArray : true,
                }
                // query : {method : 'GET'}
                // charge: {method:'POST', params:{charge:true}}
            })
    }
}