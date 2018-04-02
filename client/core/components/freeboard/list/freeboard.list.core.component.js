'use strict';

import angular from 'angular';
require('./index.css');

export default angular.module('freeboard.list.core.component.module', [])
    .component('freeboardList', {
        template: require("./index.html"),
        controller: controller,
        bindings: {
            freeboards: '<'
        }
    }).name;

function controller($scope, $state, $stateParams, $element, User, Freeboard, Noty) {
    const $ctrl = this;

    $ctrl.pageIndex = 1;
    $ctrl.$onInit = onInit;
    $ctrl.$onChanges = onChanges;
    $ctrl.clickPageNum = clickPageNum;
    $ctrl.clickFreeboard = clickFreeboard;
    $ctrl.goWriting = goWriting;
    $ctrl.onScrollTop = onScrollTop;
    $ctrl.onSearch = onSearch;
    $ctrl.loadNext = onLoadNext;
    $ctrl.showSearchBox = showSearchBox;
    $ctrl.showSortBox = showSortBox;

    const selectors = {
        searchBox : '#search-box',
        sortBox : '#sort-box',
    }

    const NOTY_MSG = {
        WRITING_NEED_USER_LOGIN : 'NOTY.FREEBOARD.WRITING_NEED_USER_LOGIN'
    }

    /**
    * Events LifeCycle
    */
    function onInit() {
        // lazy loading need...
        // active pagination index
        const currentPageIndex = parseInt($stateParams.pageIndex);
        initPageIndex(currentPageIndex);
    }

    function onChanges() {

    }

    /**
     * Events with Ajax
     */
    function goWriting() {
        User.getStatus().$promise.then(result => {
            const isSignin = result.toJSON().result;
            if (isSignin) {
                $state.go(`freeboard.writing`, {}, { reload: true });
            } else {
                Noty.show(NOTY_MSG.WRITING_NEED_USER_LOGIN, 'warning');
            }
        }, reason => {
            Noty.show('get_response_fail', 'error');
        })
    }

    function onLoadNext() {

        if ($ctrl.pageIndex == 'last') return;
        if (Freeboard.busy) return;

        const pageIndex = ++$ctrl.pageIndex;
        Freeboard.busy = true;

        Freeboard.fetchPage(pageIndex).then(response => {

            Freeboard.busy = false;
            if (response.length == 0) return $ctrl.pageIndex = 'last';

            $ctrl.freeboards = $ctrl.freeboards.concat(response);
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                $scope.$apply();
            }
        }, reason => {

        })
    }

    function onSearch() {
        const keyword = $ctrl.searchKeyword;
        $ctrl.searchKeyword = undefined;



    }

    /**
     * Events without Ajax
     */
    function onScrollTop() {
        $("html, body").animate({ scrollTop: 0 }, "slow");
    }

    function showSearchBox() {
        // $element.find(selectors.sortBox).slideDown('slow');
        $element.find(selectors.searchBox).slideUp('slow');
    }

    function showSortBox() {
        // $element.find(selectors.sortBox).slideUp('slow');
        $element.find(selectors.searchBox).slideDown('slow');
    }
    

    /**
     * Controller
     */
    function clickPageNum($event) {
        const $_dom = $element.find($event.currentTarget);
        const index = parseInt($_dom.text());
        $state.go('freeboard.page', { index: index });
    }

    function clickFreeboard(Freeboard) {
        const id = Freeboard._id;
        $state.go('freeboard.detail', { id: id });
    }


    /**
     * Views
     */

    /** Desktop */
    /**
     * Init
     */
    function initPageIndex(currentPageIndex) {
        const pageIndexes = $ctrl.pageIndexes = [];
        for (let i = 0; i < 5; i++) {
            pageIndexes.push(currentPageIndex + i);
        }
    }


    
}

