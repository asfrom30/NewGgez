'use strict';

import angular from 'angular';
require('./index.css');

export default angular.module('nav.core.component.module', [])
    .component('appNav', {
        template: require("./index.html"),
        controller: controller,
        bindings: {
        }
    }).name;

export function controller(AppLogger, User, Noty, $state, $translate, validator) {
    'ngInject';

    var $ctrl = this;
    const logFlag = false;
    const dom = {
        signInModal: '#signin-modal',
        signUpModal : '#register-modal',
    }

    $ctrl.goRandomPage = goRandomPage;
    $ctrl.goFreeBoard = goFreeBoard;
    $ctrl.changeLang = changeLang;
    $ctrl.initSignin = initSignin;
    $ctrl.signIn = signIn;
    $ctrl.signOut = signOut;
    $ctrl.signUp = signUp;

    $ctrl.$onInit = function () {
        User.getStatus().$promise.then(result => {
            const isSignin = result.toJSON().result;
            $ctrl.isSignin = isSignin;
        }, reason => {

        })

    }

    function goRandomPage() {
        const id = getRandomId();
        moveHeroPage('pc', 'kr', id);
    }

    function moveHeroPage(device, region, id) {
        if (device == undefined | region == undefined | id == undefined) {
            if (device == undefined) AppLogger.log('device is undefined, can not go hero page', logFlag, 'error');
            if (region == undefined) AppLogger.log('device is undefined, can not go hero page', logFlag, 'error');
            if (id == undefined) AppLogger.log('device is undefined, can not go hero page', logFlag, 'error');
            return;
        }
        const params = { device: device, region: region, id: id };
        $state.go(`hero.summary`, params, { reload: true });
    }

    function getRandomId() {
        const min = 1;
        let max = 13000;
        try {
            max = $ctrl.indexInformation.totalPlayers;
        } catch (error) {

        }
        const id = Math.floor((Math.random() * max) + min);

        return id;
    }

    function changeLang() {
        const langKey = $ctrl.tempSelectedLang;
        if (langKey == undefined) alert('need to select lang');
        $translate.use(langKey);
    }

    function goFreeBoard() {
        $state.go(`freeboard.list`, { pageIndex: 1 });
    }

    function initSignin() {
        $ctrl.email = undefined;
        $ctrl.password = undefined;
    }

    function signIn() {
        const email = $ctrl.email;
        const password = $ctrl.password;
        User.signIn({ email: email, password: password }).$promise.then(response => {
            const isSignin = response.toJSON().result;
            if (isSignin) {
                $(dom.signInModal).modal('hide');
                Noty.show('sign_in_success');
                $ctrl.isSignin = true;
            }
        }, reason => {
            $ctrl.wrongPassword = true;
        })
    }

    function signOut() {
        User.signOut().$promise.then(response => {
            const result = response.toJSON();
            Noty.show('sign_out_success');
            $ctrl.isSignin = false;
        }, reason => {
            Noty.show('sign_out_fail');
        })
    }

    function initSignUp() {
        $ctrl.register.userName = undefined;
        $ctrl.register.email = undefined;
        $ctrl.register.password = undefined;
        $ctrl.register.passwordConf = undefined;
    }

    function signUp() {
        const userName = $ctrl.register.userName;
        const email = $ctrl.register.email;
        const password = $ctrl.register.password;
        const passwordConf = $ctrl.register.passwordConf;

        const params = {
            userName : userName,
            email : email,
            password : password,
            passwordConf : passwordConf
        }

        User.signUp(params).$promise.then(response => {
            const data = response.toJSON();

            if(data.result) {
                $(dom.signUpModal).modal('hide');
                Noty.show('register_success');
            }
        }, reason => {
            const responseCode = reason.status;
            const data = reason.data;
            if(responseCode == 409) Noty.show(data.err, 'warning');
        })
        
    }
}
