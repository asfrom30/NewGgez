# 목차
### 서머리
### 스냅샷
### ggez vs new-ggez
### 개발
### 배포
### 운영

# 서머리
오늘날에는 굉장히 많은 게임 전적 분석툴이 있다. 그럼에도 불구하고 이러한 분석 툴이 유용하지 않는 것은 게임회사에서 제공하는 게임 데이터를 가공하지 않고 있는 그대로 보여주는 것이다. 예를 들자면 아래와 같은 식이다.

이와 같은 방식의 문제점은
1. 언제나 합산된 데이터만 볼 수 있다는 점.
1. 비교 대상이 불분명하다는 점이다.

따라서 이 프로젝트에서는 위와 같은 문제를 개선하고자 두가지 방식으로 데이터를 가공하였다.
1. 크롤링 된 데이터들간의 시간차이를 이용하여 데이터를 가공한다.
    1. 합산된 데이터가 아닌 일정 기간동안의 성적을 알 수 있다.
1. 등록된 유저들의 모든 정보를 등급별로 분류하여 등급별 데이터를 산출하여 비교 대상으로 사용한다.

# ggez vs new-ggez
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
        <td>5달<br>(진행중)</td>
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
        <td>jquery, webpack, gulp</td>
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

# 개발

개발 컨셉은 전통적인 서버1, 클라이언트1에서 벗어나 서버2, 클라이언트1로 개발하였습니다. 서버 한개가 추가된 이유는 `cron-job` 매일 정기적으로 `crawling`을 수행하는 서버를 단독으로 설계하였기 때문입니다. 많은 양의 데이터를 크롤링하다보면 서버의 스토리지가 필연적으로 계속 늘어나기 마련인데, 추후에 이러한 문제에서 데이터를 수집하는 서버와 서비스를 제공하는 서버를 나누기 위해서 이와 같은 컨셉으로 개발하게 되었습니다.

## 서버
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

## 크론(크롤링) 서버

### 미들웨어패턴

### PROMISE CHAIN 

### Mongodb Aggregate

### 로그 전략

## 클라이언트 개발

### Webpack dev-server
서버측 api가 구현되지 않았을때는 dummie api를 사용하도록

### 

# 배포
처음 개발을 했을 때는 파일질라를 이용해서 배포하였습니다. `ggez`에서 이용했던 서버는 `cpanel`을 사용한 서버 기반으로 이미 세팅이 되어 있는 상태여서 `public_html` 또는 `www` 폴더에 파일만 잘 옮겨주면 되었습니다. 기존에 있는 파일들을 모두 지우고 다시 옮겨넣는 일은 여간 번거로운 일이 아니였습니다. 따라서 현재는 아래와 같은 방식을 이용해서 자동으로 배포 하고 있습니다.

## 서버측 자동 빌드 및 배포
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

## 클라이언트 측 자동 빌드 및 배포
```js
// auto deploy client

```