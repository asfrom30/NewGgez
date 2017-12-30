

# Database Hanling

add `_id` to `crawl-datas` 

```js
// Raw Mongodb (in robomongo)
 const targetCollectionName = 'crawl-datas-171022';
 db.getCollection(targetCollectionName).find().forEach(function(doc) {
    const query = {btg : doc._id};
    let player = db.getCollection('players').findOne(query);
    
    print(player._id);
    
    doc._id = NumberInt(player._id);
    doc._btg = player.btg;
    
    db.getCollection(targetCollectionName+'_id').save(doc);
})
``` 

# Trouble Shooting
### Be careful use cronjob with p2m
pm2 restart task when task is ended. so if you didn't run cron job. it ends immediately and restart task. Thats' why cron job is not working properly.

```json
// in config.js
cron : {
    context: null,
    start: false, // don't use false mode in pm2
    runOnInit: true,
}
```
