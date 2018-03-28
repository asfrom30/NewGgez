'use strict';

import angular from 'angular';
require('./index.css');

export default angular.module('nav.core.component.module', [])
    .component('appNav', {
        template: require("./index.html"),
        controller: controller,
    }).name;

export function controller(AppLogger, User, Noty, $state, $translate, $window, $interval, validator, $element, $timeout) {
    'ngInject';

    var $ctrl = this;
    const logFlag = false;
    const dom = {
        signInModal: '#signin-modal',
        signUpModal : '#register-modal',
        accountSettingModal : '#account-setting-modal',

    };

    const notyMsg = {
        SAVE_CHANGES_SUCCESS : "SAVE_CHANGES_SUCCESS",
        SAVE_CHANGES_FAIL : "SAVE_CHANGES_FAIL",

    }

    let authBusyFlag = false;

    $ctrl.goRandomPage = goRandomPage;
    $ctrl.goFreeBoard = goFreeBoard;
    $ctrl.changeLang = changeLang;
    $ctrl.onSignupModalBtn = onSignupModalBtn;
    $ctrl.onSigninModalBtn = onSigninModalBtn;
    $ctrl.onSettingModalBtn = onSettingModalBtn;
    $ctrl.signIn = signIn;
    $ctrl.signUp = signUp;
    $ctrl.signOut = signOut;
    $ctrl.registerBtg = registerBtg;
    $ctrl.onSettingSaveChanges = onSettingSaveChanges;

    $ctrl.$onInit = function () {

        // check user status
        User.getStatus().$promise.then(result => {
            const isSignin = result.toJSON().result;
            $ctrl.isSignin = isSignin;
        }, reason => {

        });

        $timeout(function(){
            $element.find("#first-click").click();
        }, 300)
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

    function onSigninModalBtn() {
        $ctrl.email = undefined;
        $ctrl.password = undefined;
    }

    function onSettingModalBtn() {
        $ctrl.tempBattletag = undefined;

        const $_spinner = $element.find("#account-setting-spinner");
        showElement($_spinner);

        // get user profile
        User.get().$promise.then(response => {
            const result = response.toJSON().result;

            $ctrl.username = result.username;
            if(result.battletag) $ctrl.tempBattletag = result.battletag;

            hideElement($_spinner);
        }, reason => {
            console.log(reason);
            hideElement($_spinner);
        });
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

    $ctrl.test = function() {
        console.log('hi');
    }

    function onSignupModalBtn() {
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

    function registerBtg() {
        
        //FIXME: CHANGE CODE based on Cheking Event. not interval
        // bnetWindow.addEventListener('hashchange', function(e){console.log('hash changed')});
        
        // const timeout = 30;
        // let time = 0;
        // const authTimer = $interval(function() {
        //     if(time > timeout) {
        //         $interval.cancel(authTimer);
        //         bnetWindow.close();
        //         Noty.show('time out');
        //     } else {
        //         const result = bnetWindow.result;
        //         if(result == undefined) {
        //             time++;
        //         } else {
        //             $interval.cancel(authTimer);
        //             bnetWindow.close();
        //         }
        //     }
        // }, 1000);

        if(authBusyFlag) return Noty.show('already_request', 'error');
        const bnetWindow = $window.open("/api/oauth/bnet", "_blank", "width=300,height=500");
        const timeout = 30;
        let time = 0;
        authBusyFlag = true;
        const authTimer = $interval(function() {

            if(time > timeout) {
                $interval.cancel(authTimer);
                bnetWindow.close();
                Noty.show('time out');
                authBusyFlag = false;
                return;
            }

            const result = bnetWindow.result;
            if(result == undefined) {
                time++;
            } else {
                bnetWindow.close();
                $interval.cancel(authTimer);
                authBusyFlag = false;
                $ctrl.tempBattletag = result.battletag;
            }
        }, 1000);
    }

    function onSettingSaveChanges() {

        const battletag = $ctrl.tempBattletag;
        const password = $ctrl.tempPassword;
        const passwordConfirm = $ctrl.tempPassword2;

        const body = {};
        if(battletag) body.battletag = battletag;
        if(password || passwordConfirm) {
            if(password === passwordConfirm) {
                body.password = password;
            } else {
                return Noty.show('INCORRECT_PASSWORD_CONFIRM ', 'error');
            }
        }

        User.update(body).$promise.then(res => {
            const result = res.toJSON();
            const serverMsg = result.msg;
            $(dom.accountSettingModal).modal('hide');
            return Noty.show(notyMsg.SAVE_CHANGES_SUCCESS, 'info');
        }, reason => {
            const serverErrMsg = result.errMsg;
            const serverErrReason = result.errReason;
            return Noty.show(notyMsg.SAVE_CHANGES_FAIL, 'error');
        })
    }

    function hideElement($_dom) {
        $_dom.hide();
    }

    function showElement($_dom) {
        $_dom.show();
    }
}
