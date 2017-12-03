# New Ggez Back End

### Server Stack
<div>
    <img src="https://github.com/asfrom30/MyGit/blob/master/resources/images/stack/nodejs.png?raw=true" height="50">
    <img src="https://github.com/asfrom30/MyGit/blob/master/resources/images/stack/mongodb.png?raw=true" height="50">
</div>

## Code Features

### Multiple Database in one server for each Region and device

### Promise Chaining for Crawl
Cursor replaces with `Promise` and `reduce` chain
Cursor has always includ their document, so if query is ended. I closed the cursor... see below code..

### Business Logic Code

### Model Code (Database, MongoDB )
##### Sort 
```javascript
db.getCollection('playerdatas-17-11-13').find({}).sort({"_value.doomfist.치른게임" : -1}).limit(10);
```

##### update all document(13,000 docs)
I had encountered problem which is to convert one of the field value from `string` to `integer` in all document. It's easy but I spent several hours because of `Robomongo`. When I excutes my script(see below). `Robomongo` occurs `script error`. In the last, when I excutes in `mongo shell`, It works well. Even though it's same code. But here's thing what I realize. `forEach()` method in `mongoDb` and `javascript` is different. 

In the `javascript`, if you declare `async callback function` in `forEach()`. `javascript` excutes **asynchronous**. but in `Mongodb` It excutes **synchrounous**

If you want to see detail [see this](https://stackoverflow.com/questions/35820035/mongodb-cursor-method-foreach-is-non-blocking-when-native-js-foreach-is-bl)
> MongoDB's forEach is synchronous, because it performs IO, which is (generally) asynchronous in node.js. Native forEach (Array.prototype.forEach) doesn't perform any IO and that's why it's synchronous....


```javascript
db.getCollection('playerdatas-17-11-11').find().forEach( function (x) {
  if(x._meta == undefined) {
        db.getCollection('playerdatas-17-11-11').save(x);
   } else {
      if(x._meta.cptpt == "") {
            x._meta.cptpt = NumberInt(-1);
      } else {
            x._meta.cptpt = NumberInt(x._meta.cptpt);
      }
      db.getCollection('playerdatas-17-11-11').save(x);
  }
});
```

##### Aggregate
* Sample1
```javascript
    db.getCollection('playerdatas-17-11-13')
    .aggregate([
        { $match : {"_value.orisa.치른게임" : {$gt : 10}}},
        
        { $group : {
            _id : "orisa",
            testMax: { $max: { $divide: [ "$_value.orisa.방벽에준피해", "$_value.orisa.죽음" ] }},
            testMin: { $min: { $divide: [ "$_value.orisa.방벽에준피해", "$_value.orisa.죽음" ] }},
            testAvg :{ $avg: { $divide: [ "$_value.orisa.방벽에준피해", "$_value.orisa.죽음" ] }}

        }},
        
        { $sort: { "죽음당방벽에준피해" : -1} }
    ])
```

* Sample2
```javascript
db.getCollection('playerdatas-17-11-09')
    .aggregate([
        { $match : { $and : [{"_meta.cptpt": { $gte: 1000, $lte: 2000 }}, {"_value.orisa.치른게임" : {$gte : 5}}]}},
        { $addFields: {
           value1 : { $divide: [ "$_value.orisa.방벽에준피해", "$_value.orisa.죽음" ] } ,
        }},
        { $group : {
            _id : "orisa",
            count: {$sum: NumberInt(1)},
            value1Max : {$max : "$value1"},
            value1Min : {$min : "$value1"},
            value1Avg : {$avg : "$value1"},
        }},
        {$project: {
            count1 :  '$count',
            value1 : {
                average: '$value1Avg',
                max: '$value1Max',
                min: '$value1Min'
            },
            value2 : {
                average: '$inT1_average',
                max: '$inT1_max',
                min: '$inT1_min'
            }
        }}
    ])
```

### Test Code

### Util Code

##### Custom Log
[npm js-logger](https://github.com/jonnyreeves/js-logger)

##### Separate Logic and Utils code (even though it needs callback function)

```javascript
// playerData is mongoose model.
playerData.save(function(err) {
    if(err) {
        console.log(err);
        // error handling
    } else {
        let currentDate = momentTz().tz('Asia/Seoul').format('YY-MM-DD hh-mm-ss');
        console.log('btg:' + btg + ' stat inserted :: ' + currentDate);
    }
});
```

get simple thing using `return function()`

```javascript
playerData.save(insertErrorCallback(btg));

function insertErrorCallback(btg){
    return function(err) {
        if(err) {
            // error handling
        } else {
            let currentDate = momentTz().tz('Asia/Seoul').format('YY-MM-DD hh-mm-ss');
            console.log('btg:' + btg + ' stat inserted :: ' + currentDate);
        }
    }
}
```


# Trouble Shooting
### Cross-Origin-Resource-Sharing

```
// Webbrowser message
Failed to load http://localhost:3000/stored-btgs: No 'Access-Control-Allow-Origin' header is present on the requested resource. Origin 'http://localhost:9000' is therefore not allowed access.
```

# Task and Road Map
## Task
### Crawl Server Task
* travis ci

* ~~Refactoring needed at promise chaing in crawl-cron-server~~

* Develop and Production Data base must be separated
    * Use `config.js` Develop data base is `test`, production database is `pc_kr`, `pc_us`
* If error occurs(crawl, parsing etc), leave log what type of error occurs.

* After Crawl Data Analyze Tier Data...
    * Implement Using Middleware way

* After That Build Python Server

* all of code needs refactoring...(cf: with mongoose or utils.mongodbhelper)

* If object get null three times, remove from player list.

* crwal report... to Slack or Email...

### Web Server Task
* JSON Schema needed
* ~~Build web-server using express engine~~
* ~~Babel load~~
    * No need
* Set Middle Ware

* Set Config File..
* Set Node Mon...

update automatically...


## Deep Dive
* Check Mongoose Schema how many memories uses.
    * Sometimes. register mulitple collection one schema...


## Road Map
* Reverse Engineering for how to way to design in plan and code

