'use strict';

import angular from 'angular';
import apiConfig from '../../../../configs/app.api.config';

export default angular
    .module('user.service.api.v3.module', [])
    .factory('User', ['$resource', 'LOG_SETTING', function ($resource, LOG_SETTING) {

        let enableApiDummie = false;
        if (process.env.NODE_ENV === 'webpack') enableApiDummie = true;

        let api = enableApiDummie ? apiConfig.dummie.prefixUri : '' + '/api/user';

        const logFlag = LOG_SETTING.FLAG;
        const User = $resource(api, {}, {
            get: {
                method: 'GET',
            },
            update: {
                method: 'PUT',
            },
            getStatus: {
                method: 'GET',
                url: api + '/status'
            },
            signIn: {
                method: 'POST',
                url: api + '/signin'
            },
            signOut: {
                method: 'GET',
                url: api + '/signout'
            },
            signUp: {
                method: 'POST',
                url: api + '/signup'
            },
            requestInvitation: {
                method: 'GET',
                url: api + '/invitation',
            }
        })

        return new Controller(logFlag, User);
        // return User;
    }]).name;


function Controller(logFlag, User) {

    this.signIn = signIn;
    this.signUp = signUp;
    this.signOut = signOut;
    this.isSignIn = isSignIn;
    this.requestInvitation = requestInvitation;
    this.getProfile = getProfile;
    this.updateProfile = updateProfile;

    function updateProfile(userProfile) {
        return new Promise((resolve, reject) => {
            User.update({userProfile : userProfile}).$promise.then(response => {
                resolve(response.datas);
            }, reason => {
                if (logFlag) console.log(reason.data.devLogs);
                reject(reason.data.errors);
            })
        })
    }

    function getProfile() {
        return new Promise((resolve, reject) => {
            User.get().$promise.then(response => {
                resolve(response.datas);
            }, reason => {
                if (logFlag) console.log(reason.data.devLogs);
                reject(reason.data.errors);
            })
        })
    }

    function signIn(email, password) {
        const params = {
            email : email,
            password : password
        }

        return new Promise((resolve, reject) => {
            User.signIn(params).$promise.then(response => {
                resolve(response.datas);
            }, reason => {
                if (logFlag) console.log(reason.data.devLogs);
                reject(reason.data.errors);
            })
        })

    }

    function signOut() {
        return new Promise((resolve, reject) => {
            User.signOut().$promise.then(response => {
                resolve(response.datas);
            }, reason => {
                if (logFlag) console.log(reason.data.devLogs);
                reject(reason.data.errors);
            })
        })
    }
    
    function signUp(params) {
        return new Promise((resolve, reject) => {
            User.signUp(params).$promise.then(response => {
                if (logFlag) console.log(response.devLogs);
                resolve(response.datas);
            }, reason => {
                const statusCode = reason.status;
                const devLogs = reason.data.devLogs;
                const errors = reason.data.errors;

                if (logFlag) console.log(devLogs);
                reject(errors);
            })
        })
    }
    function isSignIn() {
        return new Promise((resolve, reject) => {
            User.getStatus().$promise.then(response => {
                resolve(response.datas);
            }, reason => {
                if (logFlag) console.error(reason.data.devLogs);
                reason.data.errors = reason.data.errors || {};
                reason.data.errors.msg2Client = `SERVER.can_not_read_user_status`; // mask server error
                reject(reason.data.errors);
            })
        })
    }

    function requestInvitation(email) {
        return new Promise((resolve, reject) => {
            User.requestInvitation({ email: email }).$promise.then(response => {
                if (logFlag) console.log(response.logs);
                resolve(response.datas);
            }, reason => {
                if (logFlag) console.error(reason.data.devLogs);
                reject(reason.data.errors);
            });
        })
    }

    function resultVariableArchive(response) {
        const log2Dev = response.log2Dev;
        const datas = response.datas;
    }
    
    function reasonVariableArchive(reason) {
        const log2Dev = response.log2Dev;
        const errors = reason.data.errors;

        const statusCode = reason.status;
    }


    //TODO: screwtinize
    // FIXME: study javascript feature. shallow copy
    this.shallowCopyTest = shallowCopyTest;
    function shallowCopyTest() {
        // Resource(value) {
        //     shallowClearAndCopy(value || {}, this);
        // }
        console.log(User);
        return User;
    }

    function formalResourceHandling() {
        $resource.someMethod().$promise.then(result => {
            const ngResource = result;
            const json = result.toJSON();
        }, reason => {
            const statusCode = reason.status;
            const json = reason.data;
        })
    }
}