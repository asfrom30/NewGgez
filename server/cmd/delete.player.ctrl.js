require('babel-register');

const env = 'development';
process.env.NODE_ENV = env;
const appDao = require('../core/services/dao/index');
const client = require('mongodb').MongoClient;

const btg = '냅둬라날-3934';

const url = 'mongodb://localhost/dev_web_pc_kr';

deleteCrawlData('current', btg);
deleteCrawlData('171227', btg);
deletePlayers(btg);
refreshPlayerNumber();
// insertCrawlData('current', btg);


function insertCrawlData(suffix, btg){
    client.connect(url).then(db => {
        db.collection(`crawl-datas-${suffix}`).insertOne({_btg : btg}).then(result =>{
            console.log('insert success');
            db.close();
        }, reason => {
            console.log('insert fail');
            db.close();
        })
    })
}

function deleteCrawlData(suffix, btg){
    client.connect(url).then(db => {
        db.collection(`crawl-datas-${suffix}`).deleteOne({_btg : btg}).then(result => {
            console.log(`${suffix} delete success`);
            db.close();
        }, reason => {
            console.log(`${suffix} delete failed`);
            db.close();
        })
    })
}

function deletePlayers(btg) {
    client.connect(url).then(db => {
        db.collection(`players`).deleteOne({btg : btg}).then(result =>{
            console.log(`${btg} delete success`);
            db.close();
        }, reason => {
            console.log(`${btg} insert fail`);
            db.close();
        })
    })
}

function refreshPlayerNumber() {
    client.connect(url).then(db => {
        db.collection(`counters`).updateOne({_id : 'players'}, {seq : 13675}).then(result =>{
            console.log(`refresh count success`);
            db.close();
        }, reason => {
            console.log(`refresh count failed`);
            console.log(reason);
            db.close();
        })
    })
}