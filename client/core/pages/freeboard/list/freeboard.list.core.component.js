'use strict';

import angular from 'angular';
require('./styles/index.css');

export default angular.module('freeboard.list.core.component.module', [])
    .component('freeboardList', {
        template: require("./index.html"),
        controller: controller,
        bindings: {
            freeboards : '<'
        }
    }).name;

function controller($scope, $state, $stateParams, $element, User, Freeboard, Noty) {
    const $ctrl = this;
    $ctrl.pageIndex = 1;
    $ctrl.$onInit = onInit;
    $ctrl.$onChanges = onChanges;
    $ctrl.loading = loading;
    $ctrl.clickPageNum = clickPageNum;
    $ctrl.clickFreeboard = clickFreeboard;
    $ctrl.goWriting = goWriting;
    $ctrl.loadNext = loadNext;


    function onInit() {

        // lazy loading need...
        
        // active pagination index
        const currentPageIndex = parseInt($stateParams.pageIndex);
        initPageIndex(currentPageIndex)
    }
    
    function onChanges() {
    
    }
    
    function loading() {
        console.log('loading');

        $stateParams.go
    }

    /**
     * Buttons
     */

    function goWriting() {
        User.getStatus().$promise.then(result => {
            const isSignin = result.toJSON().result;
            if(isSignin) {
                $state.go(`freeboard.writing`, {}, {reload: true});
            } else {
                Noty.show('use_only_signin_user', 'warning');
            }
        }, reason => {
            Noty.show('get_response_fail', 'error');
        })
    }

    /**
     * Controller
     */
    function clickPageNum($event) {
        const $_dom = $element.find($event.currentTarget);
        const index = parseInt($_dom.text());
        $state.go('freeboard.page', {index : index});
    }

    function clickFreeboard(Freeboard) {
        const id = Freeboard._id;
        $state.go('freeboard.detail', {id : id});
    }


    /**
     * Views
     */


    // $ctrl.reddit = new Reddit();

    // function test() {
    //     $element.find("#target").append('<div style="color:red">hi</div>');
    // }

    // $ctrl.images = [1, 2, 3, 4, 5, 6, 7, 8];
    // $ctrl.loadMore = function () {
    //     var last = $ctrl.images[$ctrl.images.length - 1];
    //     for (var i = 1; i <= 8; i++) {
    //         $ctrl.images.push(last + i);
    //     }
    // };


    
    /** Desktop */
    /**
     * Init
     */
    function initPageIndex(currentPageIndex){
        const pageIndexes = $ctrl.pageIndexes = [];
        for(let i=0; i < 5; i++){
            pageIndexes.push(currentPageIndex+i);
        }
    }

    /** Mobile */
    function loadNext() {

        if($ctrl.pageIndex == 'last') return;
        if(Freeboard.busy) return;

        const pageIndex = ++$ctrl.pageIndex;
        Freeboard.busy = true;

        Freeboard.fetchPage(pageIndex).then(response => {
            
            Freeboard.busy = false;
            if(response.length == 0) return $ctrl.pageIndex = 'last';

            $ctrl.freeboards = $ctrl.freeboards.concat(response);
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                $scope.$apply();
            }
        }, reason => {

        })

    }

}

