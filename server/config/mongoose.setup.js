/* npm modules */
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

/* custom modules */
var config = require('./environment');

//FIXME: Not access directly using mongoHelper. using mongo factory
// const mongoHelperFactory = require('../common/utils/db/mongo.db.helper.factory');

module.exports = function() {
    
    mongoose.connect('mongodb://localhost/commons', { useMongoClient: true });
    
    // register mongoose model
    // Freeboard Model
    const FreeboardModel = require('../core/api/v3/boards/freeboard/freeboard.model');
    const FreeboadCommentModel = require('../core/api/v3/boards/freeboard-comment/freeboard.comment.model');
    
    // User Model
    const User = require('../core/api/v3/user/user.model');
    const UserInvitation = require('../core/api/v3/user/user.invitation.model');
    
    //TODO: use createConnection // for dynamic 
    // var promise = mongoose.createConnection('mongodb://localhost/myapp', {
    //     useMongoClient: true,
    //     /* other options */
    //   });
    //   promise.then(function(db) {
    //     /* Use `db`, for instance `db.model()`
    //   });
    


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

    /* Register Mongoose Schema */

    /* for Dynamic Schema */
    // mongoHelperFactory.setDbUri(config.mongo.uri);

    // return promise;
}