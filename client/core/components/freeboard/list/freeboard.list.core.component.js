'use strict';

import angular from 'angular';

export default angular.module('freeboard.list.core.component.module', [])
    .component('freeboardList', {
        template: require("./index.html"),
        controller: controller,
        bindings: {
            freeboards: '<'
        }
    }).name;

function controller($scope, $state, $stateParams, $element, User, Freeboard, Noty) {

    'ngInject';

    // variables 
    const $ctrl = this;
    $ctrl.pageIndex = 1;

    // local variables
    const selectors = {
        searchBox: '#search-box',
        sortBox: '#sort-box',
    }
    const NOTY_MSG = {
        WRITING_NEED_USER_LOGIN: 'NOTY.FREEBOARD.WRITING_NEED_USER_LOGIN'
    }

    // lifecycle method
    $ctrl.$onInit = onInit;
    // ajax event method
    $ctrl.onLoadNext = onLoadNext; // infinite-scroll
    $ctrl.goWriting = goWriting;
    $ctrl.onSort = onSort;
    // non-ajax event method
    $ctrl.onScrollTop = onScrollTop;
    $ctrl.onSearchSlide = onSearchSlide;
    $ctrl.onSortSlide = onSortSlide;

    $ctrl.clickPageNum = clickPageNum;
    $ctrl.clickFreeboard = clickFreeboard;
    $ctrl.onSearch = onSearch;

    $ctrl.showSearchBox = showSearchBox;
    $ctrl.showSortBox = showSortBox;

    /**
    * LifeCycle Events
    */
    function onInit() {
        $ctrl.searchOption = {};

        // lazy loading need...
        // active pagination index
        const currentPageIndex = parseInt($stateParams.pageIndex);
        initPageIndexForDesktop(currentPageIndex);
    }

    /**
     * Ajax Events
     */
    function goWriting() {
        User.isSignIn().then(datas => {
            const isSignIn = datas.isSignin;
            if (!isSignIn) return Noty.show(NOTY_MSG.WRITING_NEED_USER_LOGIN, 'warning');
            $state.go(`freeboard.writing`, {}, { reload: true });
        }, errors => {
            if (errors.msg2Client) Noty.show(`SERVER.${errors.msg2Client}`, 'error');
        })
    }

    function onLoadNext() {

        if ($ctrl.pageIndex == 'last') return;
        if (Freeboard.busy) return;

        const pageIndex = ++$ctrl.pageIndex;
        Freeboard.busy = true;

        const params = { page: pageIndex };
        Freeboard.fetchPage(params).then(response => {

            Freeboard.busy = false;
            if (response.length == 0) return $ctrl.pageIndex = 'last';

            $ctrl.freeboards = $ctrl.freeboards.concat(response);
            updateView();
        }, reason => {

        })
    }

    function onSort() {
        const date = $ctrl.sortOption.date;
        const order = $ctrl.sortOption.order;
        let startDate = undefined;
        if (date == 'yesterday') startDate = '20180409';
        else if (date == 'today') startDate = '20180410';
        else if (date == 'weekly') startDate = '20180402';
        else if (date == 'montly') startDate = '20180309';

        const params = { startDate: startDate, order: order };

        Freeboard.fetchPage(params).then(datas => {
            $ctrl.freeboards = datas;
            updateView();
        }, errors => {
            if (errors.msg2Client) Noty.show(`SERVER.${errors.msg2Client}`, 'error');
        });
    }

    function onSearch() {
        // keyword valid check
        const keyword = $ctrl.searchOption.keyword;
        if(keyword.length == 1) return Noty.show('검색어는 두글자 이상으로 입력해야 합니다.', 'warning');

        const date = $ctrl.searchOption.date;
        let startDate = undefined;
        if (date == 'yesterday') startDate = '20180409';
        else if (date == 'today') startDate = '20180410';
        else if (date == 'weekly') startDate = '20180402';
        else if (date == 'montly') startDate = '20180309';

        const params = { startDate: startDate, keyword: keyword };

        Freeboard.fetchPage(params).then(datas => {
            $ctrl.freeboards = datas;
            updateView();
        }, errors => {
            if (errors.msg2Client) Noty.show(`SERVER.${errors.msg2Client}`, 'error');
        });
    }

    /**
     * Non-Ajax Events
     */
    function onScrollTop() {
        $("html, body").animate({ scrollTop: 0 }, "slow");
    }

    function onSearchSlide() {
        $element.find(selectors.searchBox).slideToggle('slow');
    }

    function onSortSlide() {
        $element.find(selectors.sortBox).slideToggle('slow');
    }

    /**
     * Unit Function : Controller
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

    function initPageIndexForDesktop(currentPageIndex) {
        const pageIndexes = $ctrl.pageIndexes = [];
        for (let i = 0; i < 5; i++) {
            pageIndexes.push(currentPageIndex + i);
        }
    }

    /** 
     * Unit Function : View
     */
    function updateView() {
        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') return $scope.$apply();
        if (logFlag) console.log('$scope.$apply() update view fail');
    }

    function showSearchBox() {
        // $element.find(selectors.sortBox).slideDown('slow');
        $element.find(selectors.searchBox).slideUp('slow');
    }

    function showSortBox() {
        // $element.find(selectors.sortBox).slideUp('slow');
        $element.find(selectors.searchBox).slideDown('slow');
    }
}

