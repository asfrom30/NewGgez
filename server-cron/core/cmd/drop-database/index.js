
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const readline = require('readline');
const config = require('../../../config/enviroment');
const dao = require('../../dao/index');

const client = require('mongodb').MongoClient;
// const collectionSuffix = require('../collection-suffix');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

/* connectg db uri */
const dbUri = `${config.mongo.baseUri}_${device}_${region}`;
client.connect


rl.question('What do you think of Node.js? ', (answer) => {
    // TODO: Log the answer in a database
    console.log(`Thank you for your valuable feedback: ${answer}`);

    rl.close();
});




exports.getNewPlayerId = function(device, region) {
    const dbUri = `${config.mongo.baseUri}_${device}_${region}`;
    const collectionName = 'counters';
    const targetSeqName = 'players';
    return new Promise((resolve, reject) =>{
        client.connect(dbUri).then(db => {
            db.collection(collectionName).findOne({_id : targetSeqName}).then(result => {
                db.close();
                if(result.seq == undefined) reject('seq is undefined');
                else resolve(result.seq + 1);
            }, reason => {
                db.close();
                reject(reason);
            });
        })
    })
}


