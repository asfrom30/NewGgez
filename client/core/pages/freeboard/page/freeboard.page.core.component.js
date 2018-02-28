'use strict';

import angular from 'angular';
require('./index.css');

export default angular.module('freeboard.page.core.component.module', [])
    .component('freeboardPage', {
        template: require("./index.html"),
        controller: controller,
        bindings: {
            freeboards : '<'
        }
    }).name;

function controller($state, $stateParams, $element, Freeboard, /*Reddit*/) {
    const $ctrl = this;
    $ctrl.$onInit = onInit;
    $ctrl.$onChanges = onChanges;
    $ctrl.loading = loading;
    $ctrl.clickPageNum = clickPageNum;
    $ctrl.clickFreeboard = clickFreeboard;

    function onInit() {
        // lazy loading need...
        console.log($ctrl.freeboards);
        
        // active pagination index
        const currentPageIndex = parseInt($stateParams.index);
        initPageIndex(currentPageIndex)
    }
    
    function onChanges() {
    
    }
    
    function loading() {
        console.log('loading');

        $stateParams.go
    }
    /**
     * Init
     */
    function initPageIndex(currentPageIndex){
        const pageIndexes = $ctrl.pageIndexes = [];
        for(let i=0; i < 5; i++){
            pageIndexes.push(currentPageIndex+i);
        }
    }

    /**
     * Buttons
     */
    $ctrl.goWriting = goWriting;
    function goWriting() {
        $state.go(`freeboard.writing`, {}, {reload: true});
    }

    /**
     * Controller
     */
    function clickPageNum($event) {
        const $_dom = $element.find($event.currentTarget);
        console.log($event.target);
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


    

}

