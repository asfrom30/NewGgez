process.env.NODE_ENV = 'development';
require('babel-register');

const config = require('../../../config/environment');
const client = require('mongodb').MongoClient;
const collectionSuffix = require('../collection-suffix');
// const appDao = require('./dao.server.controller');

// TODO: id integer check neede
const query = {};
const device = 'pc';
const region = 'kr';
const dbUri = `${config.mongo.baseUri}_${device}_${region}`;

const id = 43;
printBtg('171027', id);
printBtg('171028', id);
printBtg('171104', id);
printBtg('171105', id);
printBtg('171106', id);
printBtg('171107', id);
printBtg('171110', id);
printBtg('171111', id);
printBtg('171112', id);
printBtg('171113', id);
printBtg('171212', id);
printBtg('171214', id);
printBtg('current', id);

function printBtg(targetCollectionName, id) {
    const collectionName = `${config.mongo.collectionName.crawlDatas}-${targetCollectionName}`;
    client.connect(dbUri).then(db => {
        db.collection(collectionName).findOne({_id : id}, query).then(doc =>{
            db.close();
            console.log(targetCollectionName, doc._btg);
        }, reason => {
            db.close();
            console.log(reason);
        })
    })

}


