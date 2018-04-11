const seedAdminAccount = require('../../.secrets/server-secrets/admin-account');
const mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports = function() {

    // seed database for development


    // create admin account 
    const email = seedAdminAccount.email;
    const password = seedAdminAccount.password;
    
    Promise.resolve().then(() => {
        return User.findOneAndRemove({email : email});
    }).then(() => {
        const user = new User({email : email, password : password, role : 'admin'});
        return user.save()
    }).catch(reason => {
        console.error(reason);
    });
}