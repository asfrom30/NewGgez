'use strict';

import angular from 'angular';

export function HeroCompareCtrl(CONFIG, $scope, $stateParams, analyzer, CoreUtils, STATMAP){

    /* variable */
    // Get id directly from $stateParams
    var $ctrl = this;
    $ctrl.stateParams = {};
    $ctrl.stateParams.id = $stateParams.id;
    // $ctrl.radarDataset = {};
    // $ctrl.tableDataset = {};


    $ctrl.$onInit = function(){

        // WHATEVER WORKING FIRST...
        // store User PreSelected....

        // loading image first...
       

        console.log($ctrl.stateParams.id)

        /* Check Default Data */
        /* Service */
        /* get Promise */
        /* then call back function */
        // if not fetch again...

        // if not, fetch data from server, loading bar
        // empty object means that user doesn't have data at that time

        // When Initialize compelte, hero-selector disable -> able
    }
    

    /* Binding Method */
    $ctrl.selectorChanged = function(selector) {
        /* Dependency Injection */
        let firstUserSelect = selector.my;
        let secondUserSelect = selector.compare;

        /* Prepare Index */
        let firstUserId = $ctrl.stateParams.id;
        let secondUserId = $ctrl.stateParams.id;
        let firstUserDateIndexes = getIndexes(firstUserSelect);
        let secondUserDateIndexes = getIndexes(secondUserSelect);
        
        
        /* Prepare Data */
        let firstUserDataA = $ctrl.userDatas[firstUserId][firstUserDateIndexes.A];
        let firstUserDataB = $ctrl.userDatas[firstUserId][firstUserDateIndexes.B];
        let secondUserDataA = $ctrl.userDatas[secondUserId][secondUserDateIndexes.A];
        let secondUserDataB = $ctrl.userDatas[secondUserId][secondUserDateIndexes.B];

        /* Get Diff and Tier Data */
        // TODO: STATMAP MUST BE MOVED IN anaylzer service
        let firstUserDiffData = analyzer.getDiffData(firstUserDataA, firstUserDataB, STATMAP);
        let secondUserDiffData = analyzer.getDiffData(secondUserDataA, secondUserDataB, STATMAP);
        let tierData = analyzer.getTierData();

        /* Update radar and table dataset*/
        updateDataset(firstUserDiffData, secondUserDiffData, tierData);
    }
    
    $ctrl.storeUserDatas = function(id, userDatas) {
        if(angular.equals(userDatas, {}) || userDatas === undefined) {
            //TODO : Insert Custom Log.. (Debug..)
            return;
        }
        $ctrl.userDatas[id] = userDatas;
    }

    $ctrl.checkUserDatas = function(id) {
        if($ctrl.userDatas === undefined) {
            //TODO : Insert Custom Log.. (Debug..)
            return false;
        }

        if($ctrl.userDatas[id] === undefined || angular.equals($ctrl.userDatas[id], {})) {
            return false;  
        } else {
            return true;
        }
    }

    function updateDataset(firstUserDiffData, secondUserDiffData, tierData){
        
        // Make Dataset from Data
        $ctrl.radarDataset = getRadarDataset(firstUserDiffData, secondUserDiffData, tierData);
        $ctrl.tableDataset = getTableDataset(firstUserDiffData, secondUserDiffData, tierData);
    }

    function getIndexes(selectedDate){
        // if(Const.isDebug)
        if(CONFIG.DEBUG_MODE) {
            return {A: '20171024', B: '20171021'}
        }

        if(selectedDate == null || selectedDate == ''){
            return {};
        }

        /* Diff = A-B */
        // 주간 = 현재 - 1주전
        // 어제 = 오늘 - 어제
        // 오늘 = 현재 - 오늘
        // 기타 = 현재 - 기타날짜
        let result = {};

        
        switch(selectedDate) {
            case 'week' : 
                result.A = "current";
                result.B = CoreUtils.getDateIndex(7);
                break;
            case 'yesterday' : 
                result.A = CoreUtils.getDateIndex(0);
                result.B = CoreUtils.getDateIndex(1);
                break;
            case 'today' :
                result.A = "current";
                result.B = CoreUtils.getDateIndex(0);
                break;
            default :
                result.A = "current";
                result.B = selectedDate;
                break;  
        }
        return result;
    }

    function getTableDataset(myDiffData, compareDiffData, tierData) {

        let result = {};

        for(let heroId in STATMAP){
            result[heroId] = [];
            for(var i=0; i < STATMAP[heroId].length; i++){
                let column = {
                    title : myDiffData[heroId][i].title,
                    my : [ myDiffData[heroId][i].point, myDiffData[heroId][i].score ],
                    compare : [ compareDiffData[heroId][i].point, compareDiffData[heroId][i].score ],
                    tier : null,
                }
                result[heroId].push(column);
            }
        }
        return result;
    }

    function getRadarDataset(myDiffData, compareDiffData, tierData) {
        /* Data Structure */
        // [
        //     [//iPhone
        //         {axis:"Battery Life",value:0.22},
        //         {axis:"Brand",value:0.28},
        //         {axis:"Contract Cost",value:0.29},
        //         {axis:"Design And Quality",value:0.17},
        //         {axis:"Have Internet Connectivity",value:0.22},
        //         {axis:"Large Screen",value:0.02},
        //         {axis:"Price Of Device",value:0.21},
        //         {axis:"To Be A Smartphone",value:0.50}			
        //     ],[//Samsung
        //         {axis:"Battery Life",value:0.27},
        //         {axis:"Brand",value:0.16},
        //         {axis:"Contract Cost",value:0.35},
        //         {axis:"Design And Quality",value:0.13},
        //         {axis:"Have Internet Connectivity",value:0.20},
        //         {axis:"Large Screen",value:0.13},
        //         {axis:"Price Of Device",value:0.35},
        //         {axis:"To Be A Smartphone",value:0.38}
        //     ],[//Nokia Smartphone
        //         {axis:"Battery Life",value:0.26},
        //         {axis:"Brand",value:0.10},
        //         {axis:"Contract Cost",value:0.30},
        //         {axis:"Design And Quality",value:0.14},
        //         {axis:"Have Internet Connectivity",value:0.22},
        //         {axis:"Large Screen",value:0.04},
        //         {axis:"Price Of Device",value:0.41},
        //         {axis:"To Be A Smartphone",value:0.30}
        //     ]
        // ]
        let result = {
            
        };

        return result;
    }
}

export default angular
    .module('hero.compare', [])
    .component('heroCompare', {
        controller : HeroCompareCtrl,
        template : require('./hero.compare.html'),
        bindings : {
            userDatas : '<',
        }
    }).name;