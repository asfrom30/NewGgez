/* npm modules */
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

/* custom modules */
var config = require('./environment');

//FIXME: Not access directly using mongoHelper. using mongo factory
// const mongoHelperFactory = require('../common/utils/db/mongo.db.helper.factory');

module.exports = function() {
    //TODO: use createConnection
    // var promise = mongoose.createConnection('mongodb://localhost/myapp', {
    //     useMongoClient: true,
    //     /* other options */
    //   });
    //   promise.then(function(db) {
    //     /* Use `db`, for instance `db.model()`
    //   });

    //TODO: After that.. need autoIncrement
    // autoIncrement.initialize(db);
    
    /* Multipel Database One Schema*/
    // const mongoConnList = {};
    // for(let key in config.mongo.uriList) {
    //     mongoConnList[key] = mongoose.connect(config.mongo.uriList[key], {
    //         useMongoClient: true,
    //     })
    // }

    // for(let key in mongoConnList) {
    //     const playerSchema = require('../core/api/v3/player/player.server.model');
    //     // mongoose.model('Player', PlayerSchema);
    //     mongoConnList[key].model(`Players${key}`, playerSchema);
    // }

    /* Connect to Mongo */
    // var promise = mongoose.connect(config.mongo.uri, {
    //     useMongoClient: true,
    // });

    /* for Mongoose Schema */
    // require('../core/api/v3/player/player.server.model');

    /* for Dynamic Schema */
    // mongoHelperFactory.setDbUri(config.mongo.uri);

    // return promise;
}