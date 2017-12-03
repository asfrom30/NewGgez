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
and I seperate crawl-server for not giving a load to web-server. 

### Datas Handling
It's not easy to analyze many datas. and harder thing is there are so many cases of data type. For example. each data can be separated 8 tier groups. and each data has 22 heroes. and each hero has 10~20 skills.

## App Features
### Ajax Live Search

### End Point

URL | VERB | POST BODY | Result |
--- | --- | --- | --- |
/stored-btgs/:btg| GET | empty | Check Player exists
/stored-btgs/:btg| PUT | empty | Register user based on battle tag if valid user
/player-datas/:id| GET | empty | require `date query param'

cf) player-datas/1/?date=17-10-18,17-10-21,17-10-22,17-10-23

## Code Features
### Server Features
[See detail serverside readme](./server/README.md)

##### Multiple Database but One server
It is implemented each datas are stored in each databases but in the one server.


### Client Features
[See detail clientside readme](./client/README.md)

## And more..
### Develop Process
* Scrum