/**
 * version 0.0.3
 */

var dbBaseUri;
var dbName;
var instance;

exports.printDbUri = function(){
    console.log('============print db uri');
    console.log(dbBaseUri);
    console.log(dbName);
    console.log('============print db uri');
}

exports.setDbUri = function(input_dbBaseUri, input_dbName) {
    
    if (arguments[0] == null) throw new Error('mongo.db.helper needs dbUri argument');
    if (arguments[1] == null) throw new Error('mongo.db.helper needs dbName argument');
    
    dbBaseUri = input_dbBaseUri;
    dbName = input_dbName;
}

 exports.getInstance = function(){
    if (dbBaseUri == undefined) throw new Error('mongo.db.helper needs dbUri argument');
    if (dbName == undefined) throw new Error('mongo.db.helper needs dbName argument');

    instance = require('./mongo.db.helper');
    instance.setDb(dbBaseUri, dbName);

    return instance;
}



// @Deprecated
//  exports.getInstance = function(dbBaseUri, dbName){
    
//     if (arguments[0] == null) throw new Error('mongo.db.helper needs dbUri argument');
//     if (arguments[1] == null) throw new Error('mongo.db.helper needs dbName argument');

//     this.instance = require('./mongo.db.helper');
    
//     this.instance.setDb(dbBaseUri, dbName);

//     return this.instance;
//  }

 // FIXME: set, change db and getInstance with no params...