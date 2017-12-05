/* npm modules */
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
// var autoIncrement = require('mongoose-auto-increment');

exports.init = function(dbUrl) {
   
    console.log("connect to :: " + dbUrl);

    var promise = mongoose.connect(dbUrl, {
        useMongoClient: true,
    });

    /* Register model */
    require('../app/model/player.web.server.model');
    // var Player = require('mongoose').model('Player'); // Declare this, when uses in contorller;

    /* Make Schema for dynamicaly load */
    
    // register dynamical
    // var playerDataSchema = require('../app/model/player.data.schema');
    // mongoose.model('Player-10-13', playerDataSchema.get(), collectionName); // TODO: Check if too many models cached, mongoose is ok?
    // var Player = require('mongoose').model('Player');

    return promise;
}