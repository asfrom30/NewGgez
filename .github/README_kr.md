# 목차

# 서머리
서버측은 `web-server`, `cron-server`로 이루어지고 클라이언트측은 `SPA(single page application)`으로 구상하여 개발하였다. `cron-server`를 `web-server`와 통합하지 않은 이유는 추후에 `web-server`의 부하를 고려하여 서버의 스토리지가 늘어났을 때 유연하게 대처하기 위해, 언제든지 물리적으로 분리할 수 있게 `standalone`하게 설계 하였다.

# as-was vs as-is
<table style="text-align:center">
    <tr>
        <th colspan="2">구분</th>
        <th>as-was(ggez)</th>
        <th>as-is(new-ggez)</th>
        <th>to-be</th>
        <th>detail</th>
    <tr>
    <tr>
        <td rowspan="6">개발</td>
        <td>기간</td>
        <td>3달</td>
        <td>5달</td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>언어</td>
        <td>php, javascript, html, css</td>
        <td>javascript, html, css</td>
        <td>-</td>
        <td>Link</td>
    </tr>
    <tr>
        <td>프레임워크</td>
        <td>-</td>
        <td>nodejs, express, angularjs</td>
        <td>-</td>
        <td>-</td>
    </tr>
    <tr>
        <td>데이터베이스</td>
        <td>mysql</td>
        <td>mongodb</td>
        <td>-</td>
        <td>-</td>
    </tr>
    <tr>
        <td>부가기술</td>
        <td>jquery</td>
        <td>jquery, webpack</td>
        <td>-</td>
        <td>-</td>
    </tr>
    <tr>
        <td>태스크러너</td>
        <td></td>
        <td>gulp</td>
        <td>-</td>
        <td>-</td>
    </tr>
    <tr>
        <td>크롤링시간</td>
        <td>약 5시간<br>/ 13,000</td>
        <td>약 2시간 30분<br>/ 13,000</td>
        <td>-</td>
        <td>-</td>
    </tr>
    <tr>
        <td rowspan="3">운영</td>
        <td>데일리 레포트</td>
        <td>수동<br>(매일 조회)</td>
        <td>자동<br>(매일 이메일)</td>
        <td>-</td>
        <td>-</td>
    </tr>
    <tr>
        <td>빌드</td>
        <td>-</td>
        <td>gulp and webpack<br>(vendor and bundle)</td>
        <td>-</td>
        <td>-</td>
    </tr>
    <tr>
        <td>배포</td>
        <td>수동<br>(파일질라)</td>
        <td>자동<br>(ssh, gulp, linux)</td>
        <td>-</td>
        <td>-</td>
    </tr>
    <tr>
        <td rowspan="2">테스트</td>
        <td>서버</td>
        <td>-</td>
        <td>-</td>
        <td>mocha, chai</td>
        <td>-</td>
    </tr>
    <tr>
        <td>클라이언트</td>
        <td>-</td>
        <td>-</td>
        <td>karma, protractor</td>
        <td>-</td>
    </tr>
</table>

# 웹 서버
### 라우터
api는 `route.js`에서 일괄적으로 미들웨어에 등록한다. 라우터에 등록되는 함수는 컨트롤러로 따로 분리하여 작성하였으며, 각 컨트롤러에서는 비즈니스 로직을 수행하면서 데이터베이스에 접근한다. 각 컨트롤레어서 데이테베이스에 접근하는 함수는 중복되는 경우가 많으므로 `service dao`로 모듈화하여 분리 작성하였다.

```js
// router
// /server/routes.js
'use strict';
export default function(app) {
    app.param('device', function(req, res, next, device){
        req.device = device;
        next();
    });

    app.param('region', function(req, res, next, region){
        req.region = region;
        next();
    })

    app.use('/:device/:region/players', require('./core/api/v3/player'));
    app.use('/:device/:region/crawl-datas', require('./core/api/v3/crawl-data'));
    app.use('/:device/:region/tier-datas', require('./core/api/v3/tier-data'));
    app.use('/:device/:region/index-information', require('./core/api/v3/index-information'));
    app.use('/:device/:region/sessions', require('./core/api/v3/sessions'));

    // All undefined asset or api routes should return a 404
    app.route('/:url(api|auth|components|app|bower_components|assets)/*')
    .get(errors[404]);

    // All other routes should redirect to the index.html
    app.route('/*')
        .get((req, res) => {
        res.sendFile(path.resolve(`${app.get('appPath')}/index.html`));
    });
}
```
```js
// controller 
// path : /server/core/api/v3/crawl-data
'use strict';

var express = require('express');
var controller = require('./crawl.data.server.controller');

var router = express.Router();

router.param('id', controller.storedId);

router.get('/:id', controller.query);
router.put('/:id', controller.update);

module.exports = router;
```

```js
// app dao
// path : /server/core/services/dao/dao.server.controller.js
exports.getNewPlayerId = function(device, region) {
    ...
}

exports.insertPlayer = function (device, region, doc) {
}

exports.insertTodayCrawlData = function(device, region, doc) {
    ...
}

exports.insertCurrentCrawlData = function(device, region, doc) {
    ...
}

exports.findPlayerById = function(device, region, id) {
    ...
}

exports.findPlayerByIds = function(device, region, ids) {
    ...
}


exports.findPlayerBtgById = function(device, region, id) {
    ...
}

exports.findPlayerByBtg = function(device, region, btg) {
    ...
}

exports.findPlayerByRegex = function(device, region, regex) {
    ...
}

exports.findCrawlDataById = function(device, region, collectionSuffix, id) {
    ...
}

exports.findCrawlDataByBtg = function(device, region, collectionSuffix, btg) {
    ...
}

exports.findCurrentCrawlDataById = function(device, region, id) {
    ...
}

exports.findTierDataByDate = function(device, region, date) {
    ...
}

exports.updatePlayer = function(device, region, id, doc) {
    ...
}

exports.updateTodayCrawlData = function(device, region, id, doc) {
    ...
}

exports.updateCurrentCrawlData = function(device, region, id, doc) {
    ...
}

exports.getIndexInformation = function(device, region) {
    ...
}
```

### RESTApi
##### players
URL | VERB | REQUIRED | Result |
--- | --- | --- | --- |
:device/:region/players/?btg=`btg` | GET | - | 사용자를 배틀태그로 검색
:device/:region/players/:id | GET | - | 사용자를 아이디로 검색
:device/:region/players/ | PUT | require body `{btg : btg}` | 오버워치에서 해당 사용자를 검색하여 등록, 없으면 `400`에러, 이미 등록된 아이디이면 `409`

##### craw-datas
URL | VERB | REQUIRED | Result |
--- | --- | --- | --- |
:device/:region/crawl-datas/:id?date=YYMMDD, YYMMDD| GET | date query | 배열로 반환
:device/:region/crawl-datas/:id| PUT | - | 플레이어 프로필 및 크롤링 데이터 최신상태로 갱신


##### tier-data
URL | VERB | REQUIRED | Result |
--- | --- | --- | --- |
:device/:region/crawl-datas/:id?date=YYMMDD | GET | date query | 사용자 수와 총 게임수 전송

##### index-information
URL | VERB | REQUIRED | Result |
--- | --- | --- | --- |
:device/:region/index-information | GET | - | 티어 결과값 전송


##### sessions
URL | VERB | REQUIRED | Result |
--- | --- | --- | --- |
:device/:region/sessions/favorites| GET | - | 세션 쿠키에 즐겨찾기 읽어오기
:device/:region/sessions/favorites/?id={id}| PUT | - | 세션 쿠키에 즐겨찾기 추가
:device/:region/sessions/favorites/?id={id}| DELETE | - | 세션 쿠키에 즐겨찾기 삭제
:device/:region/sessions/thumbs| GET | - | 세션 쿠키에 추천 읽어오기
:device/:region/sessions/thumbs/?id={id}| PUT | - | 세션 쿠키에 추천 추가
:device/:region/sessions/thumbs/?id={id}| DELETE | - | 세션 쿠키에 추천 삭제

# 크론(크롤링) 서버
### Crwal Promise Chain
PHP에서는 아래와 같이 방식으로 1만개가 넘는 크롤링을 수행하도 문제가 없었지만 NodeJS에서는 아래와 같이 실행을 하면 서버가 다운된다.

```js
appDao.getAllPlayers(players => {
    for(const player of players) {
        // do crawl.
    }
})
```
이는 NodeJS가 event driven 방식이기 때문에 크롤링이 완료된 뒤에 두번째 크롤링을 수행하는 것이 아니라. FOR LOOP를 돌면서 즉시 크롤링을 요청해버리기 때문이다. 즉 아주짧은 시간내에 해당 players에 대한 모든 크롤링을 한번에 요청해버린다. 따라서 크롤링을 아래와 같은 promise chain으로 엮어준다.

```js
players.reduce(function(prePromise, currentValue, currentIndex, array){
    const id = currentValue._id;
    const btg = currentValue.btg;
    return prePromise.then(() => {
        /* end of promise chain */
        if(currentIndex == playerNum -1) {
            console.log('end one of crawl thread task...' + btg);
            resolve();
            return;
        }
        return crawlAndSave.doAsync(id, btg, crawlConfig, saveConfig);
    })
}, Promise.resolve());

```
### Cron Job Middleware Pattern

### Mongodb Aggregate

### 로그 전략

### Webpack dev-server
서버측 api가 구현되지 않았을때는 dummie api를 사용하도록

# 클라이언트
## Folder Structure

## Image Resource
No hard wiring. see const resrouces.map.js(now resrouce.const.js)

## Common css 전략

## Web component

## Ajax
Loading Bar appear and disappear

## Dummie Api

## 리치 컴포넌트 전략

## binding data 전략

# Sides
## Webpack
* make webpack.config.js

* if you want to use `import` syntax install package which is relate to babel(babel-loader, babel-core etc)

* in the webpack config this option is very useful `devtool: 'inline-source-map',`

* if you want watch html and css file being changed. import that `import './{filename}.html'`;

* in the webpack syntax, use `name;`
```javascript
angular.module.xxx.name;
```

* To use full jquery(angular has only jqlite), Jquery plugin option must be declared also you need to install jquery package 
```javascript
plugins: [
    new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery' // for angularjs
    })
    // new webpack.optimize.UglifyJsPlugin(),
    // new HtmlWebpackPlugin({template: './src/index.html'})
]
```


# 배포
빌드를 수행하여 dist 폴더에 

ssh와 linux shell을 사용하여 자동 배포를 수행합니다.

## 서버 자동 빌드 및 배포
```js
// auto deploy server
gulp.task('auto:deploy:server', cb => {
    runSequence(
        ['clean:dist:server', 'clean:dist:package'], // clean dist folder
        ['transpile:server','copy:server'], // compile and copy extras(ini file, json file)
        'remote:bluehost:clean:server', // clean remote server
        'remote:bluehost:copy:server',  // move files using ssh
        'remote:bluehost:run:server', // npm install and restart using pm2 
        cb
    )
});
// auto deploy cron-server
gulp.task('auto:deploy:server', cb => {
    // same as server
});
```

## 크론 서버 자동 빌드 및 배포

## 클라이언트 자동 빌드 및 배포
```js
// auto deploy client

```

## 클라이언트 자동 빌드 및 배포(exclude assets)
조그마한 버그픽스나 사소한 스타일 하나를 수정해야할때 asset까지 포함하여 배포하지 않고 `bundle.js`만 배포하도록 수정하였다.(`vendor.js` 제외)


# Trouble Shooting
* [web-server trouble shooting](./server/README.md)
* [cron-server trouble shooting](./server-cron/README.md)
* [client trouble shooting](./client/README.md)