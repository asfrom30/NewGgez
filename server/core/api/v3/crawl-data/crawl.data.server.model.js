var mongoose= require('mongoose');
var Schema = mongoose.Schema;

var PlayerDataSchema = new Schema({
    _id     : Number,
    _btg    : String,
    _value  : Object,
    // NEED _meta
})

mongoose.model('PlayerData', PlayerDataSchema);