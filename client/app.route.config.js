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

    /* Hero Paerent */
    $stateProvider.state(getHeroParentState());
    /* Hero Child */
    $stateProvider.state(getHeroSummaryState());
    $stateProvider.state(getHeroDetailState());
    $stateProvider.state(getHeroCompareState());
    $stateProvider.state(getHeroRankState());

    /* Hero Admin Page */
    var heroAdminState = {
        name : 'hero.admin',
        url  : '/admin/{device}/{region}/{id}',
        template: '<h1>Hero Admin</h1><pre>{{$root.players | json}}</pre>',
        controller : function($rootScope, $scope, people, userDatas, players, Ajax) {
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
            resolvedCrawlDatas : function($stateParams, Ajax, CoreUtils) {
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

                return Ajax.fetchCrawlDatas(device, region, id);
            },
        },
    }
}

function getHeroSummaryState() {
    return {
        name: 'hero.summary',
        url : '/summary/{device}/{region}/{id}',
        component : 'heroSummary',
    }
}

function getHeroDetailState() {
    return {
        name: 'hero.detail',
        url : '/detail/{device}/{region}/{id}',
        component : 'heroDetail',
    }
}

function getHeroCompareState() {
    return {
        name: 'hero.compare',
        url : '/compare/{device}/{region}/{id}',
        component : 'heroCompare',
    }
}

function getHeroRankState() {
    return {
        name: 'hero.rank',
        url : 'rank/{device}/{region}/{id}',
        component : 'heroRank',
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




