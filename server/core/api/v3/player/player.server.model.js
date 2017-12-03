var mongoose= require('mongoose');
var Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);

var PlayerSchema = new Schema({

    _id             : Number,
    
    btg            : String,
    btn            : String,
    
    iconUrl         : String,
    level           : Number,
    cptpt           : Number,

    starCount       : { type: Number, default: 0 },

    thumbCount      : { type: Number, default: 0 },
    commentCount    : { type: Number, default: 0 },


    lastUpdateTimeStamp : Date,
    registerTimeStamp : Date,
}, { _id: false })

PlayerSchema.plugin(AutoIncrement);


module.exports = PlayerSchema;
