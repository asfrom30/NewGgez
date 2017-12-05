/**
 *  Version : 0.0.3
 */

var Logger = require('../utils.logger');
var client = require('mongodb').MongoClient;

module.exports = function () {
    /* Constructor  */
    /* Static This is constructed just one time */

    this.setDb = function setDb(dbBaseUri, dbName){
        // this.dbUri = dbBaseUri + dbName;
        this.dbUri = dbBaseUri + dbName;
    };

    /* TODO: Logger Setting */
    // const Logger = Logger('mongo.db.helper');

    /**
     * Function Declaration
     */

    /* Create Collection */ 
    this.createCollection = function(collectionName) {
        return new Promise((resolve, reject) => {
            if(this.dbUri == undefined) reject('Db Uri is undefined in mongodb Helper...');
            client.connect(this.dbUri)
                .then(db => {
                    db.createCollection(collectionName)
                        .then(result => {
                            db.close();
                            resolve();
                        });
                })
        })
    }


    /* Drop Collection */
    this.dropCollection = function(collectionName) {
        return new Promise((resolve, reject) => {
            if(this.dbUri == undefined) reject('Db Uri is undefined in mongodb Helper...');
            client.connect(this.dbUri)
                .then(db => {
                    return new Promise((resolve, reject) => {
                        db.listCollections().toArray()
                            .then(replies => {
                                var found = false;
        
                                replies.forEach(function(document) {
                                    if(document.name == collectionName) {
                                        found = true;
                                    }
                                });

                                if(found) {
                                    resolve(db);
                                }
                                else {
                                    let reason = "drop target collection [" + collectionName + "] not found";
                                    reject({db : db, reason : reason});    
                                }
                            });
                        })
                })
                .then(db => {
                    return new Promise((resolve, reject) => {
                        db.collection(collectionName).drop()
                            .then(result => {
                                resolve(db);
                            }, reason => {
                                reject({db : db, reason : reason});
                            })
                    })
                })
                .then(db=>{
                    // All of promise chaing works successfully. db.close();
                    db.close();
                    resolve();
                }).catch(reasons => {
                    // If one of chaing is broken.. excutes this
                    if(reasons.db != undefined) reasons.db.close();
                    reject(reasons.reason);
                })
        })
    }


    /**
     * FIND
     * $ne is comparison Query Operator,
     * See more https://docs.mongodb.com/manual/reference/operator/query-logical/
     */
    // e.g.) Query 
    // var query = { _id : 1}
    // var query = { _id : {$ne : indexDocumentId} };
    this.find = function (collectionName, query, callback) {
        if (arguments.length == 2) return findWithPromise(this.dbUri, collectionName, query); // using promise
        else if (arguments.length == 3) findWithCallback(this.dbUri, collectionName, query, callback); // using callback
    }

    this.findOne = function(collectionName, query) {
        return new Promise((resolve, reject) => {
            client
                .connect(this.dbUri)
                .then(db => {
                    db.collection(collectionName)
                        .findOne(query)
                        .then(res => {
                            resolve(res);
                        }).catch(reason => {
                            db.close();
                        })
                })

        //FIXME: HANDLE REJECT...reject()
        })
    }

    /* Insert One */
    this.insertOne = function (collectionName, document, callback) {
        if (arguments.length == 2) return insertOneWithPromise(this.dbUri, collectionName, document); // using promise
        else if (arguments.length == 3) insertOneWithCallback(this.dbUri, collectionName, document, callback);
    }

    this.insertOnePK = function (collectionName, pk, document, callback) {
        if (arguments.length == 3) return insertOnePkWithPromise(this.dbUri, collectionName, pk, document); // using promise
        else if (arguments.length == 4) insertOnePkWithCallback(this.dbUri, collectionName, pk, document, callback);
    }

    this.insertOneAI = function (collectionName, document, callback) {
        if (arguments.length == 2) return insertOneWithAIWithPromise(this.dbUri, collectionName, document); // using promise
        // else if(arguments.length == 3) return; // TODO: NOT YET DECLARED
        // else throw new Error("");
    }

    return this;
}();

/* Find */
function findWithPromise(databaseUri, collectionName, query) {
    return new Promise(function (resolve, reject) {
        client.connect(databaseUri).then(function (db) {
            var results = [];
            db.collection(collectionName).find(query).toArray()
                .then(function (res) {
                    results = res.slice();
                    db.close();             //FIXME: Cursor close neede....
                    resolve(results);   //FIXME: Cursor occurs heavy load... so make this method to copy array... and close cursor and return array through resolve;
                });
        });
    });
}

function findWithCallback(databaseUri, collectionName, query, callback) {
    client.connect(databaseUri, function (err, db) {
        if (err) throw err;

        db.collection(collectionName).find(query).toArray(function (err, docs) {
            callback(docs);
            db.close();
        });
    })
}

function insertOneWithPromise(databaseUri, collectionName, document) {
    var promise = new Promise(function (resolve, reject) {
        client.connect(databaseUri)
            .then(function (db) {
                db.collection(collectionName).insertOne({_value: document });
                db.close();
            })
    });

    return promise;
}

function insertOneWithCallback(databaseUri, collectionName, document, callback) {
    client.connect(databaseUri, function (err, db) {
        db.collection(collectionName).insertOne({ _value: document }, function (err, res) {
            if (err) console.log(err);   //TODO: error loging....
            else {
                callback(); // Only Callback execute when Query successes
            }
            db.close();
        });
    });
}




function insertOnePkWithPromise(databaseUri, collectionName, pk, document) {
    var promise = new Promise(function (resolve, reject) {
        client.connect(databaseUri)
            .then(function (db) {
                db.collection(collectionName).insertOne({ _id: pk, _value: document });
                db.close();
                resolve();
            })
    });

    return promise;
}

function insertOnePkWithCallback(databaseUri, collectionName, pk, document, callback) {
    client.connect(databaseUri, function (err, db) {
        db.collection(collectionName).insertOne({ _id: pk, _value: document }, function (err, res) {
            if (err) console.log(err);   //TODO: error loging....
            else {
                callback(); // Only Callback execute when Query successes
            }
            db.close();
        });
    });
}


function insertOneWithAIWithPromise(databaseUri, collectionName, document) {

    var promise = new Promise(function (resolve, reject) {
        client.connect(databaseUri)
            .then(function (db) {
                var sequence = Promise.resolve();
                sequence.then(function () { return incCollectionIndex(db, collectionName); })
                    .then(function (result) {
                        var index = -1;
                        if (result.value === null) {
                            initCollectionIndex(db, collectionName);
                            index = 1;
                        } else {
                            index = result.value[indexValueKey];
                        }
                        document["_id"] = index;
                        return document;
                    }, function (err) { })
                    .then(function (document) {
                        return db.collection(collectionName).insertOne(document);
                    })
                    .then(function (result) {
                        db.close();
                        resolve();
                    })
                    .catch(function () {
                        db.close();
                        resolve();
                    });
            })
    });
    return promise;
}




/* This Declaration is for remove index result from results*/
function queryMasking(query) {
    var indexDocumentId = "indexDocument";
    var query = { _id: { $ne: indexDocumentId } };
    return query;
}


/* This Declaration is for Auto Increament */
const indexDocumentId = "indexDocument";
const indexValueKey = "indexValue";

function initCollectionIndex(db, collectionName) {
    var jsonVar = { _id: indexDocumentId };
    jsonVar[indexValueKey] = 1;
    db.collection(collectionName).insertOne(jsonVar);
}

function incCollectionIndex(db, collectionName) {
    var jsonVar = {};
    jsonVar[indexValueKey] = 1;

    var promise = db.collection(collectionName).findAndModify(
        { _id: indexDocumentId },
        [],
        { $inc: jsonVar },
        // {$inc:{indexValueKey:1}},
        { new: true });
    return promise;
}

/* After refactoring, below method will be deprecated */
exports.find = function (collectionName, query) {
    return new Promise(function (resolve, reject) {
        client.connect(dbUri).then(function (db) {
            let promise = db.collection(collectionName).find(query).toArray();
            db.close();
            resolve(promise);
        });
    });
}

// /* InsertOne */
// exports.insertOneWithPromise = function(collectionName, document){
//     var promise = new Promise(function(resolve, reject){
//         client.connect(dbUri)
//         .then(function(db){
//             var sequence = Promise.resolve();
//             sequence.then(function(){ return incCollectionIndex(db, collectionName);})
//             .then(function(result){
//                 var index = -1;
//                 if(result.value === null){
//                     initCollectionIndex(db, collectionName);
//                     index = 1;
//                 } else {
//                     index = result.value[indexValueKey];
//                 }
//                 document["_id"] = index;
//                 return document;
//             }, function(err){})
//             .then(function(document){
//                 return db.collection(collectionName).insertOne(document);
//             })
//             .then(function(result){
//                 db.close();
//                 resolve();
//             })
//             .catch(function(){
//                 db.close();
//                 resolve();
//             });
//         })
//     });
//     return promise;
// }

// /* Insert One Document with Auto Increment */
// exports.insertOneWithAI = function(collectionName, document){
//     client.connect(dbUri, function (err, db){
//         if(err) {
//             console.log(err);
//             db.close();
//         } else {
//             var sequence = Promise.resolve();
//             sequence.then(function(){ return incCollectionIndex(db, collectionName);})
//             .then(function(result){
//                 var index = -1;
//                 if(result.value === null){
//                     initCollectionIndex(db, collectionName);
//                     index = 1;
//                 } else {
//                     index = result.value[indexValueKey];
//                 }
//                 document["_id"] = index;
//                 return document;
//             }, function(err){})
//             .then(function(document){
//                 db.collection(collectionName).insertOne(document);
//             }, function(err){})
//             .then(function(){db.close();})
//             .catch(function(){db.close();});
//         }
//     });
// }