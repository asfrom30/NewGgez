const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        require: true,
        trim: true,
    },
    userName: {
        type: String,
        required: true,
        unique: false,
        trim: true
    },
    battleTag: {
        type: String,
        trim: true
    },
    battleName: {
        type: String,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
})

module.exports.createUser = function (newUser, callback) {
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(newUser.password, salt, function (err, hash) {
            // Store hash in your password DB.
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}

//hashing a password before saving it to the database
UserSchema.pre('save', function (next) {
    const user = this;
    user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(5), null);
    next();
});

UserSchema.pre('findOneAndUpdate', function (next) {
    const user = this;

    if (user._update.password) user._update.password = bcrypt.hashSync(user._update.password, bcrypt.genSaltSync(5), null);
    next();
});


UserSchema.methods.encryptPassword = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};

UserSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

/* document filter */
if (!UserSchema.options.toObject) UserSchema.options.toObject = {};
UserSchema.options.toObject.transform = function (doc, ret, options) {
    delete ret.password; // remove the _id of every document before returning the result
    return ret;
}

const User = mongoose.model('User', UserSchema);

module.exports = User;

