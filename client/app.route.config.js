'use strict';

// [ui.router](https://github.com/angular-ui/ui-router/wiki/URL-Routing)
// fieldValue : '<', // `<` symbol denotes one-way bindings
// filedType : '@?', // = two-way binding, @ one-way
// onUpdate : '&'

const logScope = 'app-route-config';

//FIXME: DI is not wokring in routeConfig param

export function routeConfig($stateProvider, $urlServiceProvider) {

    /* otherwise redirect to index */
    $urlServiceProvider.rules.otherwise({ state: 'index' });
    
    /* Index Component */
    $stateProvider.state(getIndexState());

    /* Hero Paerent and Child */
    $stateProvider.state(getHeroParentState());
    

    var heroSummaryState = {
        name: 'hero.summary',
        url : '/summary/{device}/{region}/{id}',
        component : 'heroSummary',
    }

    var heroDetailState = {
        name: 'hero.detail',
        url : '/detail/{device}/{region}/{id}',
        component : 'heroDetail',
    }

    var heroCompareState = {
        name: 'hero.compare',
        url : 'compare/{device}/{region}/{id}',
        component : 'heroCompare',
    }

    
    $stateProvider.state(heroSummaryState);
    $stateProvider.state(heroDetailState);
    $stateProvider.state(heroCompareState);

    /* Hero Admin Page */
    var heroAdminState = {
        name : 'hero.admin',
        url  : '/admin/{id}',
        template: '<h1>Hero Admin</h1><pre>{{$root.players | json}}</pre>',
        controller : function($rootScope, $scope, people, userDatas, players, Ajax) {
            console.log($rootScope.players);
            $scope.userDatas = userDatas;
            $rootScope.players = players;
        }
    }
    $stateProvider.state(heroAdminState);


    /* test state */
    var testState = {
        name : 'test',
        url : '/test',
        component : 'test'
    }

    var testPercentLoader = {
        name : 'test.percentLoader',
        url : '/test/percent-loader',
        component : 'percentLoader'
    }

    $stateProvider.state(testState);
    $stateProvider.state(testPercentLoader);

}

function getIndexState() {
    return {
        name: 'index',
        url: '/index',
        component: 'index',
        resolve: {
            indexInformation : function(Ajax) {
                return Ajax.fetchIndexInformation();
            }
        },
    }
}

function getHeroParentState() {
    return {
        name: 'hero',
        url : '/hero',
        component : 'hero',
        resolve: {
            resolvedTierData : function($stateParams, Ajax){
                const device = $stateParams.device;
                const region = $stateParams.region;
                const date = '171206';
                if(device == undefined || region == undefined) {
                    console.log('one of device, region is undefind in resolved TierData');
                    return;
                }
                return Ajax.fetchTierDatas(device, region, date);
                
            },
            resolvedPlayer : function($stateParams, Ajax) {
                const device = $stateParams.device;
                const region = $stateParams.region;
                const id = $stateParams.id;
                
                if(device == undefined || region == undefined || id == undefined) {
                    // if(device == undefined) AppLogger.log('device is undefined', 'warn', logScope)
                    // if(region == undefined) AppLogger.log('region is undefined', 'warn', logScope)
                    // if(id == undefined) AppLogger.log('id is undefined', 'warn', logScope)

                    if(device == undefined) console.log('device is undefined');
                    if(region == undefined) console.log('region is undefined');
                    if(id == undefined) console.log('id is undefined');
                    //move another page
                    return;
                }
                
                return Ajax.fetchPlayerWithId(device, region, id);
            },
            resolvedPlayerData : function($stateParams, Ajax, CoreUtils) {
                const device = $stateParams.device;
                const region = $stateParams.region;
                const id = $stateParams.id;
                
                if(device == undefined || region == undefined || id == undefined) {
                    // if(device == undefined) AppLogger.log('device is undefined', 'warn', logScope)
                    // if(region == undefined) AppLogger.log('region is undefined', 'warn', logScope)
                    // if(id == undefined) AppLogger.log('id is undefined', 'warn', logScope)

                    if(device == undefined) console.log('device is undefined');
                    if(region == undefined) console.log('region is undefined');
                    if(id == undefined) console.log('id is undefined');
                    //move another page
                    return;
                }

                let dates = [];
                dates.push('171104');
                dates.push('171105');
                dates.push('171106');
                dates.push('171212');
                dates.push('current');
                // dates.push(CoreUtils.getTodayIndex());
                // dates.push(CoreUtils.getYesterIndex());
                return Ajax.fetchCrawlDatas(device, region, id, dates);
            },
        },
    }
}

/* preload resources in case plunker times out */
// app.run(function($http, $templateRequest) {
//   $http.get('data/users.json', { cache: true });
//   $templateRequest('partials/users.html');
//   $templateRequest('partials/userDetail.html');
// })



/* Deprecated */
/*
export function routeConfig($locationProvider, $routeProvider, THINGS_VIEWS) {
    'ngInject';

    $locationProvider.hashPrefix('!');
  
    $routeProvider
        .when( '/index', {
            templateUrl : THINGS_VIEWS + 'index/index.html',
            controller : 'indexCtrl'
        })
        .when('/views/hero/detail',{
            templateUrl : '/views/hero/detail/detail.html',
            controller : 'HeroDetailViewCtrl'
        })
        .when('/views/hero/summary/:id', {
            templateUrl : '/views/hero/summary/summary.html',
            controller : 'HeroSummaryViewCtrl'
        })
        .when('/views/rank', {

        })
        .otherwise('/index');
        // .when('/my-detail/:id', {
        //     template: '<my-detail></my-detail>'
        // })
        // .when('/my-summary/:id', {
        //     template: '<my-summary></my-summary>'
        // })
        // .when('/compare/:idA/:idB', {
        //     template: '<compare></compare>'
        // })
        // .otherwise('/');
}
*/




