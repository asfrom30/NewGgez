

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