const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const currentSchema = new Schema({
    email : String,
    sessionOwnerKey : String,
    invitationCode : Number,
    failCounter : Number,
}, {timestamps: true});

currentSchema.index({createdAt: 1}, {expireAfterSeconds: 300});

module.exports = mongoose.model('UserInvitation', currentSchema);
