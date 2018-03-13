
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FreeboardCommentSchema = new Schema({
    content     : String,
    owner       : {type: Schema.Types.ObjectId, ref : 'User'},
    freeboard   : { type: Schema.Types.Number, ref: 'Freeboard' },
    upVote      : Number,
    downVote    : Number,
}, { timestamps: true});


module.exports = mongoose.model('FreeboardComment', FreeboardCommentSchema);