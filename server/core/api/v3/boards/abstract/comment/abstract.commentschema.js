const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    text    : String,
    owner    : String,
    upVote  : Number,
    downVote : Number,
}, { timestamps: true});

module.exports = CommentSchema;