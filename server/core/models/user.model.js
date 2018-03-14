const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        require: true,
        trim: true,
    },
    username: {
        type: String,
        required: true,
        unique : false,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
})

module.exports.createUser = function(newUser, callback){
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            // Store hash in your password DB.
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}

//hashing a password before saving it to the database
UserSchema.pre('save', function (next) {
    const user = this;
    const salt= bcrypt.genSaltSync(5);
    // bcrypt.hashSync(user.password, bcrypt.genSalt)
    console.log(salt);
    user.password = bcrypt.hashSync(user.password, salt, null);
    next();
});

UserSchema.methods.encryptPassword = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};

UserSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

const User = mongoose.model('User', UserSchema);
module.exports = User;

