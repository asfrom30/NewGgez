
const client = require('mongodb').MongoClient;

const uri = 'mongodb://localhost/sandbox';
const options = {
    upsert : false
}
client.connect(uri).then(db => {
    db.collection('sandbox').updateOne({_id : 2}, {$set : { err : 'hello-update-2'}}, options).then(result =>{
        console.log('success');
        db.close();
    }, reason => {
        console.log('fail');
        db.close();
    })
})

