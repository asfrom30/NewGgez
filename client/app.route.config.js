'use strict';

// [ui.router](https://github.com/angular-ui/ui-router/wiki/URL-Routing)
// fieldValue : '<', // `<` symbol denotes one-way bindings
// filedType : '@?', // = two-way binding, @ one-way
// onUpdate : '&'

export function routeConfig($stateProvider, $urlServiceProvider) {

    /* otherwise redirect to index */
    $urlServiceProvider.rules.otherwise({ state: 'index' });
    
    var index = {
        name: 'index',
        url: '/index',
        component: 'index',
    }

    var heroState = {
        name: 'hero',
        url : '/hero',
        component : 'hero',
        resolve: {

            /* Sample Code */
            // people : function(){
            //     return {value: 'simple!'};
            // },
            // userDatas   : function($stateParams, Ajax) {
            //     let id = $stateParams.id;
            //     return Ajax.fetchUserDatas(id); // return Promise
            // },
            resolvedTierData   : function(Ajax){
                return Ajax.fetchTierDatas();
            },
            resolvedPlayer     : function($stateParams, Ajax) {
                let id = $stateParams.id;
                return Ajax.fetchPlayerWithId(id);
            },
            resolvedPlayerData : function($stateParams, Ajax, CoreUtils) {
                let id = $stateParams.id;
                let dates = [];
                dates.push('17-11-04');
                dates.push('17-11-05');
                dates.push('17-11-06');
                dates.push('17-11-07');
                dates.push('current');
                // dates.push(CoreUtils.getTodayIndex());
                // dates.push(CoreUtils.getYesterIndex());
                return Ajax.fetchPlayerDatas(id, dates);
            },
        },
    }

    var heroSummaryState = {
        // name: 'hero.summary',
        // url : '/{id}',
        name: 'hero.summary',
        url : '/summary/{id}',
        component : 'heroSummary',
    }

    var heroDetailState = {
        name: 'hero.detail',
        url : '/detail/{id}',
        component : 'heroDetail',
    }

    var heroCompareState = {
        name: 'hero.compare',
        url : '/compare/{id}',
        component : 'heroCompare',
    }

    $stateProvider.state(index);
    $stateProvider.state(heroState);
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

    // $stateProvider.state('userlist', {
    //     url: '/users',
    //     templateUrl: './partials/users.html',
    //     controller: 'UsersController',
    //     resolve: {
    //       users: function(UserService) {
    //         return UserService.list();
    //       }
    //     }
    //   });
        
    // $stateProvider.state('userlist.detail', {
    //     url: '/:userId',
    //     templateUrl: './partials/userDetail.html',
    //     controller: 'UserDetailController',
    //     resolve: {
    //         user: function($transition$, users) {
    //         return users.find(user => user.id == $transition$.params().userId);
    //         }
    //     }
    // });

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




