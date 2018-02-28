const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);
// const BoardSchema = require('../abstract/board/abstract.board.schema');
// const FreeboardCommentSchema = mongoose.model('FreeboardComment').schema;

const FreeboardSchema = new Schema({
    _id             : Number,
    title           : String,
    content         : Object,
    comments        : [{ type: Schema.Types.ObjectId, ref: 'FreeboardComment' }]
}, { _id: false, timestamps: true});

FreeboardSchema.plugin(AutoIncrement);

module.exports = mongoose.model('Freeboard', FreeboardSchema);
