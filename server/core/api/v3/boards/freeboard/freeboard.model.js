const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);
// const BoardSchema = require('../abstract/board/abstract.board.schema');
// const FreeboardCommentSchema = mongoose.model('FreeboardComment').schema;

const FreeboardSchema = new Schema({
    _id             : Number,
    title           : String,
    owner           : {type: Schema.Types.ObjectId, ref : 'User'},
    content         : Object, // quill delta structure
    text            : String, // for search
    comments        : [{ type: Schema.Types.ObjectId, ref: 'FreeboardComment' }],
    upvoteUsers     : [{ type: Schema.Types.ObjectId, ref: 'User' }],
    viewCount       : Number,
    commentCount    : Number,
    upvoteUserCount : Number,
    notice : Boolean,
}, { _id: false, timestamps: true});

FreeboardSchema.index({title : 'text', text : 'text'});
FreeboardSchema.plugin(AutoIncrement);

module.exports = mongoose.model('Freeboard', FreeboardSchema);
