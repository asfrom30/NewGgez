const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const BoardSchema = new mongoose.Schema({
    _id             : Number,
    title           : String,
    content         : String,
}, { _id: false, timestamps: true});



module.exports = BoardSchema;
