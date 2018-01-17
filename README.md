한국어 사용자라면 여기로 이동해주세요. [링크](./README_kr.md)
# Introduction

One years ago I developed totally same web application [ggezkr](https://github.com/asfrom30/ggezkr) using `php`, `mysql`, `javascript`. In that time, I think that's the best way for web develop, because I had no idea about.

And then first deployment finished. I realized how important about `good code`.

So I re-develop using `MEAN Stack`.

I'm not a web-developer yet(I've been working on mechanical design for 5.6 years in Samsung). But someday I will be...

Hopefully, enjoy my web application.

## About this project

### Stack
<div>
    <img src="https://github.com/asfrom30/MyGit/blob/master/resources/images/stack/nodejs.png?raw=true" height="50">
    <img src="https://github.com/asfrom30/MyGit/blob/master/resources/images/stack/mongodb.png?raw=true" height="50">
    <img src="https://github.com/asfrom30/MyGit/blob/master/resources/images/stack/angularjs.png?raw=true" height="50">
</div>
<div>
    <img src="https://github.com/asfrom30/MyGit/blob/master/resources/images/stack/es6.png?raw=true" height="50">
    <img src="https://github.com/asfrom30/MyGit/blob/master/resources/images/stack/html.png?raw=true" height="50">
    <img src="https://github.com/asfrom30/MyGit/blob/master/resources/images/stack/css3.png?raw=true" height="50">
    <img src="https://github.com/asfrom30/MyGit/blob/master/resources/images/stack/jquery.png?raw=true" height="50">
</div>

### Server architect
and I seperate crawl-server for not giving a load to web-server. standalone crawl-server.

daily crawlled data has each collection and suffix depending on date...

웹서버는 크론서버와 데이터베이스를 공유하는 동시에 만약의 경우에 대비해서 standalone하게 설계 되었다.

### Datas Handling
It's not easy to analyze many datas. and harder thing is there are so many cases of data type. For example. each data can be separated 8 tier groups. and each data has 22 heroes. and each hero has 10~20 skills.

## App Features
### Ajax Live Search

### End Point

URL | VERB | REQUIRED | Result |
--- | --- | --- | --- |
:device/:region/players/?btg=`btg` | GET | empty | request player resource depend on battle tag
:device/:region/players/:id | GET | empty |  request plyaer resource depend on id
:device/:region/players/ | POST | require body `{btg : btg}` |  try to register new player depend one battle tag()
:device/:region/crawl-datas/:id| GET | require `date query param` | 
:device/:region/crawl-datas/:id| PUT | empty | update `player profile` and `crwal-datas-current`
:device/:region/sessions/favorites| GET | empty |  
:device/:region/sessions/favorites/?id={id}| PUT | empty | 
:device/:region/sessions/favorites/?id={id}| DELETE | empty |
:device/:region/sessions/thumbs| GET | empty |  
:device/:region/sessions/thumbs/?id={id}| PUT | empty | 
:device/:region/sessions/thumbs/?id={id}| DELETE | empty | 

cf) player-datas/1/?date=17-10-18,17-10-21,17-10-22,17-10-23

## Code Features
### Server Features
[See detail serverside readme](./server/README.md)

##### Multiple Database but One server
It is implemented each datas are stored in each databases but in the one server.


### Client Features
[See detail clientside readme](./client/README.md)

## And more..
* Scrum

* eslint

## Remain Tasks and Trouble Shooting

### Trouble shooting
- [ ] hero summary with dev server
- [ ] check why cron-server did now excutes, tier data task.

### Refactoring
- [ ] insert crawl-data id
- [ ] collection prefix in client 
    - in now push manually

### Features
- [ ] impl hero detail and compare (apply table)
- [ ] need informat rest api
- [ ] check crawl current time : it update method rest api
- [ ] ajax live search
- [ ] ranking table

### Server Side
- [x] build and run server..
    - merging crawl server based on region, device
- [ ] need crawl status
    - deprecated, timestamp...

## Distribution

## And more...
- [ ] devops : automatically build, dev, distribution, test
- [ ] client cache storage using Stack(Max stack limitation)
- [ ] continuous build : travis
- [ ] impl test code and refactoring impl test code in client side..(protractor and jasmine)
- [ ] i18n
- [ ] apply local css