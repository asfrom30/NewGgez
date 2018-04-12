'use strict';

import angular from 'angular';
require('./index.css');

import { notyMsg } from './local-const'
import { dom } from './local-const'

export default angular.module('nav.core.component.module', [])
    .component('appNav', {
        template: require("./index.html"),
        controller: controller,
    }).name;

export function controller(AppLogger, User, Freeboard, Noty, LOG_SETTING, $scope, $state, $translate, $window, $interval, validator, $element, $timeout) {
    'ngInject';

    var $ctrl = this;

    // ajax event
    $ctrl.onSignIn = onSignIn;
    $ctrl.onSignUp = onSignUp;
    $ctrl.onSignOut = onSignOut;
    $ctrl.onRequestInvitation = onRequestInvitation;
    $ctrl.registerBtg = registerBtg;
    $ctrl.onProfileUpdate = onProfileUpdate;
    // non-ajax event
    $ctrl.goRandomPage = goRandomPage;
    $ctrl.goFreeBoard = goFreeBoard;
    $ctrl.changeLang = changeLang;
    $ctrl.onClickNotice = onClickNotice;

    // ajax events : modal btn
    $ctrl.onSettingModalBtn = onSettingModalBtn;
    // non-ajax event : modal btn
    $ctrl.onSignUpModalBtn = onSignUpModalBtn;
    $ctrl.onSignInModalBtn = onSignInModalBtn;


    const logFlag = LOG_SETTING.FLAG;

    const ajaxFlags = {
        invitation: false,
        updateProfile: false,
    }

    let authBusyFlag = false;


    $ctrl.$onInit = function () {
        $ctrl.ajaxFlags = ajaxFlags;
        $ctrl.register = {};
        $ctrl.signIn = {};
        $ctrl.formErrors = {}; // reset
        updateUserSignInStatus();
        updateNotice();
        initForDev();
    }

    function initForDev() {
        if (process.env.NODE_ENV !== 'development') return;
        $ctrl.isSignIn = true;
        $timeout(function () {
            $element.find("#first-click").click();
        }, 300)
    }

    function updateUserSignInStatus() {
        User.isSignIn().then(datas => {
            $ctrl.isSignin = datas.isSignin;
        }, errors => {
            if (errors.msg2Client) Noty.show(`SERVER.${errors.msg2Client}`, 'error');
        });
    }

    function updateNotice() {
        const params = { page: 1, notice: true }

        Freeboard.fetchPage(params).then(datas => {
            $ctrl.notices = datas;
        }, errors => {
            console.log(errors);
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

    function onSignInModalBtn() {
        resetSignInVariables();
        resetSignInFormErrors();
    }

    // need ajax
    function onSettingModalBtn() {
        // reset state
        $ctrl.enable = {};
        setUpdateProfileFlag(false);

        // di
        const $_spinner = $element.find("#account-setting-spinner");
        showElement($_spinner);

        // get user profile
        User.getProfile().then(datas => {
            updateUserProfile(datas.userProfile);
        }, errors => {
            if (errors.msg2Client) Noty.show(`SERVER.${errors.msg2Client}`, 'error');
        }).then(() => {
            hideElement($_spinner);
        });
    }

    function onSignIn() {
        // reset state;
        resetSignInFormErrors();

        // di
        const email = ($ctrl.signIn.email + '').trim();
        const password = $ctrl.signIn.password ? ($ctrl.signIn.password + '') : undefined;

        // client form validate
        const isEmailValidError = !validator.isEmail(email);
        if (isEmailValidError) setSignInEmailFormError(true);
        if (!password) setSignInPasswordFormError(true);

        const hasError = hasAnyValidateError($ctrl.formErrors.signIn);
        if (hasError) return;

        User.signIn(email, password).then(datas => {
            Noty.show(notyMsg.SIGN_IN_SUCCESS, undefined, 'short', hideSignInModal);
            $ctrl.isSignin = true;
        }, errors => {
            if (errors.msg2Client) Noty.show(`SERVER.${errors.msg2Client}`, 'error', 'short');
        })
    }

    function onSignOut() {
        User.signOut().then(datas => {
            Noty.show(notyMsg.SIGN_OUT_SUCCESS, undefined, 'short');
            $ctrl.isSignin = false;
        }, errors => {
            Noty.show(notyMsg.SIGN_OUT_FAIL);
        })
    }
    function onSignUpModalBtn() {
        stopEmailExpirationTimer();
        $ctrl.register = {};
        $ctrl.formErrors.signUp = {};
        $ctrl.ajaxFlags = {};
    }

    function onRequestInvitation() {

        // reset state;
        setEmailValidError(false);

        // client valid check
        const email = ($ctrl.register.email + '').trim();
        const isEmailValidError = !validator.isEmail(email);
        if (isEmailValidError) return setEmailValidError(true);

        $ctrl.ajaxFlags.invitation = true;

        User.requestInvitation(email).then(datas => {
            if (datas.msg2Client) Noty.show(`SERVER.${datas.msg2Client}`);
            startEmailExpirationTimer(datas.expireAfterSeconds);
        }, errors => {
            if (errors.msg2Client) Noty.show(`SERVER.${errors.msg2Client}`, 'warning');
        }).then(() => {
            $ctrl.ajaxFlags.invitation = false;
        })
    }

    function onSignUp() {

        // di
        const userName = $ctrl.register.userName ? $ctrl.register.userName + '' : '';
        const email = $ctrl.register.email + '';
        const password = $ctrl.register.password;
        const passwordConf = $ctrl.register.passwordConf;
        const invitationCode = $ctrl.register.invitationCode;


        // client side validate
        $ctrl.formErrors = $ctrl.formErrors || {}; // reset
        $ctrl.formErrors.signUp = {};

        const length = userName.length;
        if (length < 2 || 10 < length) $ctrl.formErrors.signUp.userName = true;
        if (!validator.isEmail(email)) $ctrl.formErrors.signUp.email = true;
        //TODO: invitation code validate
        //TODO: password validate

        const hasError = hasAnyValidateError($ctrl.formErrors.signUp);
        if (hasError) return;

        const params = {
            userName: userName,
            email: email,
            invitationCode: invitationCode,
            password: password,
            passwordConf: passwordConf
        }

        User.signUp(params).then(datas => {
            if (!datas.signUpResult) return;

            $(dom.signUpModal).modal('hide');
            Noty.show(`NOTY.SIGN_UP.REGISTER_SUCCESS`);
        }, errors => {
            if (errors.formErrors) { } // TODO: form error handling
            if (errors.msg2Client) Noty.show(`SERVER.${errors.msg2Client}`);
        })
    }

    function registerBtg() {

        //FIXME: CHANGE CODE based on Cheking Browser Window Event. not interval
        // bnetWindow.addEventListener('hashchange', function(e){console.log('hash changed')});
        if (authBusyFlag) return Noty.show('already_request', 'error');
        const bnetWindow = $window.open("/api/oauth/bnet", "_blank", "width=300,height=500");
        const timeout = 30;
        let time = 0;
        authBusyFlag = true;
        const authTimer = $interval(function () {

            if (time > timeout) {
                $interval.cancel(authTimer);
                bnetWindow.close();
                Noty.show('time out');
                authBusyFlag = false;
                return;
            }

            const result = bnetWindow.result;
            if(!result) return time ++

            bnetWindow.close();
            $interval.cancel(authTimer);
            authBusyFlag = false;
            $ctrl.userProfile.battleTag = result.battletag;
        }, 1000);
    }

    function onProfileUpdate() {
        // client validate
        const userProfile = $ctrl.userProfile;
        if (!isValidUserProfile(userProfile)) return;

        setUpdateProfileFlag(true);

        User.updateProfile(userProfile).then(datas => {
            updateUserProfile(datas.userProfile);
            // close modal and noty to client
            return Noty.show(notyMsg.SAVE_CHANGES_SUCCESS, 'info', 'short', function() {
                $(dom.accountSettingModal).modal('hide');
            });
        }, errors => {
            Noty.show(`SERVER.${errors.msg2Client}`, 'error');
        }).then(() => {
            setUpdateProfileFlag(false);
            updateView();
        });
    }

    function onClickNotice(noticeId) {
        $state.go(`freeboard.detail`, { id: noticeId }, { reload: true });
    }

    /** Unit Function */
    function isValidUserProfile(userProfile) {
        resetAllFormErrors();

        // DI
        const battletag = $ctrl.battleTag;
        const password = $ctrl.tempPassword;
        const passwordConfirm = $ctrl.tempPassword2;
        
        // client form validate
        const length = userProfile.userName;
        if (length < 2 || 10 < length) $ctrl.formErrors.setting.userName = true;
        // if (battletag) body.battletag = battletag;
        // if (password || passwordConfirm) {
        //     if (password === passwordConfirm) {
        //         body.password = password;
        //     } else {
        //         return Noty.show('INCORRECT_PASSWORD_CONFIRM ', 'error');
        //     }
        // }

        const hasError = hasAnyValidateError($ctrl.formErrors.setting);
        return !hasError;
    }

    function updateUserProfile(userProfile) {
        if (userProfile == undefined) return $ctrl.userProfile == undefined;
        $ctrl.userProfile = userProfile;
        updateView();
    }

    function resetSignInVariables() {
        $ctrl.signIn = {};
    }

    function resetAllFormErrors() {
        $ctrl.formErrors = {};
        $ctrl.formErrors.signIn = {};
        $ctrl.formErrors.signUp = {};
        $ctrl.formErrors.setting = {};

    }
    function resetSignInFormErrors() {
        $ctrl.formErrors = $ctrl.formErrors || {};
        $ctrl.formErrors.signIn = {};
    }

    function hideSignInModal() {
        $(dom.signInModal).modal('hide');
    }

    function hideElement($_dom) {
        $_dom.hide();
    }

    function showElement($_dom) {
        $_dom.show();
    }

    function setEmailValidError(flag) {
        $ctrl.formErrors.signUp = $ctrl.formErrors.signUp || {};

        if (flag) {
            $ctrl.formErrors.signUp.email = true;
        } else {
            $ctrl.formErrors.signUp.email = false;
        }
    }

    function setSignInEmailFormError(flag) {
        $ctrl.formErrors.signIn = $ctrl.formErrors.signIn || {};

        if (flag) {
            $ctrl.formErrors.signIn.email = true;
        } else {
            $ctrl.formErrors.signIn.email = false;
        }
    }

    function setSignInPasswordFormError(flag) {
        $ctrl.formErrors.signIn = $ctrl.formErrors.signIn || {};

        if (flag) {
            $ctrl.formErrors.signIn.password = true;
        } else {
            $ctrl.formErrors.signIn.password = false;
        }
    }

    function hasAnyValidateError(objErrors) {
        for (let error of Object.values(objErrors)) {
            if (error) return true;
        }

        return false;
    }

    function startEmailExpirationTimer(emailExpirationTime) {

        if (emailExpirationTime == null || emailExpirationTime == 0) return;
        stopEmailExpirationTimer();

        $ctrl.expireAfterSeconds = emailExpirationTime;

        const interval = $interval(function () {
            $ctrl.expireAfterSeconds--;
            if ($ctrl.expireAfterSeconds == 0) $interval.cancel(interval);
        }, 1000);

        $ctrl.emailExpireInterval = interval;
    }

    function stopEmailExpirationTimer() {
        if ($ctrl.emailExpireInterval) $interval.cancel($ctrl.emailExpireInterval);
        $ctrl.expireAfterSeconds = 0;
    }

    function setUpdateProfileFlag(bool) {
        $ctrl.ajaxFlags = $ctrl.ajaxFlags || {};
        $ctrl.ajaxFlags.updateProfile = bool;
    }

    function updateView() {
        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') return $scope.$apply();
        if (logFlag) console.log('$scope.$apply() update view fail');
    }
}
