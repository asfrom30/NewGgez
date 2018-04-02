'use strict';

import angular from 'angular';
import apiConfig from '../../../../configs/app.api.config';

export default angular
    .module('user.service.api.v3.module', [])
    .factory('User', ['$resource', function ($resource) {

        let enableApiDummie = false;
        if(process.env.NODE_ENV === 'webpack') enableApiDummie = true;

        let api = enableApiDummie ? apiConfig.dummie.prefixUri : '' + '/api/user';

        
        const User = $resource(api, {}, {
            get : {
                method : 'GET',
            },
            update : {
                method : 'PUT',
            },
            getStatus : {
                method : 'GET',
                url : api + '/status'
            },
            signIn : {
                method : 'POST',
                url : api + '/signin'
            },
            signOut : {
                method : 'GET',
                url : api + '/signout'
            },
            signUp : {
                method : 'POST',
                url : api + '/signup'
            },
            requestInvitation : {
                method : 'GET',
                url : api + '/invitation',
            }
        })

        return User;
    }]).name;
