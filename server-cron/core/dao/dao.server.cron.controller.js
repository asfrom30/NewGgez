const config = require('../../config/enviroment')
const client = require('mongodb').MongoClient;
const mongoHelperFactory = require('../../common/utils/db/mongo-helper-factory');
/**
 *      Insert Query
 */

 /* Insert Player has Auto Incremental */
exports.insertPlayer = function(databaseName, document, callback/* if null, promise working */){
    var helper = new mongoDbHelper.MongoDbHelper(databaseName); //TODO: separate outside...
    var collectionName = "players";
    if(arguments.length == 2)  return helper.insertOneAI(collectionName, document);// using promise
    else if(arguments.length == 3) helper.insertOneAI(collectionName, document, callback);
}
/* Insert PlayerData */
exports.insertPlayerData = function(databaseName, collectionName, btg, stat, callback/* if null, promise working */){
    var helper = new mongoDbHelper.MongoDbHelper(databaseName); //TODO: separate outside...
    if(arguments.length == 4) return helper.insertOnePK(collectionName, btg, stat);
    else if(arguments.length == 5) helper.insertOnePK(collectionName, btg, stat, callback);
    // else (arguments.length == 5)
}

exports.insertCrawlData = function(device, region, collectionSuffix, docs){
    const dbUri = `${config.mongo.baseUri}_${device}_${region}`;
    const collectionName = `crawldata-${collectionSuffix}`;
    
    return new Promise((resolve, reject) => {
        client.connect(dbUri).then(function(db){
            db.collection(collectionName).insertOne(docs).then((r) =>{
                db.close();
                resolve();
            }).catch((err) => {
                reject(err.errmsg);
            })
        })       
    })
}

/**
 *      Read Query
 */

/* Find All Player in Database(pc_kr, pc_us).... */

exports.findAllPlayers = function(device, region) {
    console.log('find all player in ' + device, region);
    return new Promise((resolve, reject) => {
        setTimeout(function() {
            // resolve([{btg : '냅둬라날-3934'}, {btg : 'Ac8-31846'}, {btg : '냅둬라날-3934'}, {btg : 'Ac8-31846'}, {btg : '냅둬라날-3934'}, {btg : 'Ac8-31846'}])
            resolve([{btg : '냅둬라날-3934', id : 1}, {btg : 'Ac8-31846', id : 2}, {btg : '냅둬라날-3934', id : 3}])
        })
    }, 3000);
}
//@deprecated 2017.12.05
// exports.findAllPlayers = function(dbName, callback){
    
//     var collectionName = "temp_playerlist";

//     var helper = new mongoDbHelper.MongoDbHelper(dbName); //TODO: separate outside...

//     var indexDocumentId = "indexDocument";
//     var query = {};
//     var query = { _id : {$ne : indexDocumentId} }; // not include which _id is not `indexDocumentId`

//     if(arguments.length == 1) return helper.find(collectionName, query);
//     else if (arguments.length == 2) helper.find(collectionName, query, callback);
//     else throw new Error("Arguments Exception in ggez-crud.js");
// }

exports.findAllPlayerDatas = function(dbName, collectionName, calback){
    
    var helper = new mongoDbHelper.MongoDbHelper(dbName); //TODO: separate outside...

    var query = {};

    if(arguments.length == 2) return helper.find(collectionName, query);
    else if (arguments.length == 3) helper.find(collectionName, query, callback);
    else throw new Error("Arguments Exception in ggez-crud.js");
}

exports.findPlayer = function(index){
    // findPlayer overloading...
}

